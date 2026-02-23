const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [
            customers,
            vehiclesWithRecalls,
            recentOutreach,
            todaysJobs
        ] = await Promise.all([
            prisma.customer.findMany({
                include: {
                    vehicles: true,
                    serviceJobs: true
                }
            }),
            prisma.vehicle.findMany({
                where: {
                    recalls: {
                        some: {} // Any vehicle with at least one recall
                    }
                },
                include: {
                    recalls: true,
                    customer: true
                }
            }),
            prisma.outreachLog.findMany({
                take: 20,
                orderBy: {
                    sentAt: 'desc'
                },
                include: {
                    customer: true
                }
            }),
            prisma.serviceJob.findMany({
                where: {
                    serviceDate: {
                        gte: startOfToday
                    }
                }
            })
        ]);

        // Build stats object
        const stats = {
            servicePulse: {
                active: customers.filter(c => c.status === 'active').length,
                atRisk: customers.filter(c => c.status === 'at-risk').length,
                drifted: customers.filter(c => c.status === 'drifted').length,
                recovered: customers.filter(c => c.status === 'recovered').length,
                messagesSentToday: recentOutreach.filter(o =>
                    o.type === 'servicepulse' && new Date(o.sentAt) >= startOfToday
                ).length,
                upsellsDetectedToday: todaysJobs.reduce((count, job) =>
                    count + (job.upsellOpportunities ? JSON.parse(job.upsellOpportunities).length : 0), 0)
            },
            recallReach: {
                totalVehiclesWithRecalls: vehiclesWithRecalls.length,
                pendingNotification: vehiclesWithRecalls.filter(v =>
                    v.recalls.some(r => r.status === 'pending')
                ).length,
                notified: vehiclesWithRecalls.filter(v =>
                    v.recalls.some(r => r.status === 'notified')
                ).length,
                criticalUnnotified: await prisma.recall.count({
                    where: { severity: 'critical', status: 'pending' }
                })
            },
            tradeIQ: {
                hotLeads: customers.filter(c => c.purchaseLikelihoodScore >= 75).length,
                readyToBuy: customers.filter(c => c.purchaseLikelihoodScore >= 90).length,
                avgTradeValue: 0
            }
        };

        // Calculate average trade value
        const customersWithTradeValue = customers.filter(c => c.tradeValueEstimate !== null && c.tradeValueEstimate !== undefined);
        if (customersWithTradeValue.length > 0) {
            const totalTradeValue = customersWithTradeValue.reduce((sum, c) => sum + c.tradeValueEstimate, 0);
            stats.tradeIQ.avgTradeValue = Math.round(totalTradeValue / customersWithTradeValue.length);
        }

        // Build priorityActions array
        let priorityActions = [];

        // Check vehicles With Recalls for Priority 0, 1, and 1
        vehiclesWithRecalls.forEach(v => {
            const c = v.customer;

            // CRITICAL (priority 0)
            if (c.purchaseLikelihoodScore >= 80 && v.recalls.some(r => r.status === 'notified')) {
                priorityActions.push({
                    priority: 0,
                    type: 'CRITICAL',
                    message: `Recall visit opportunity — score ${c.purchaseLikelihoodScore}, trade value ready`,
                    customer: c,
                    vehicle: v,
                    engine: 'RecallReach'
                });
            }

            // HIGH (priority 1) - Drifted + Pending Recall
            if (c.status === 'drifted' && v.recalls.some(r => r.status === 'pending')) {
                priorityActions.push({
                    priority: 1,
                    type: 'HIGH',
                    message: `Lost customer - recall is re-entry opportunity`,
                    customer: c,
                    vehicle: v,
                    engine: 'RecallReach'
                });
            }

            // HIGH (priority 1) - Critical Severity + Pending Recall
            if (v.recalls.some(r => r.severity === 'critical' && r.status === 'pending')) {
                priorityActions.push({
                    priority: 1,
                    type: 'HIGH',
                    message: `Critical safety recall — notify immediately`,
                    customer: c,
                    vehicle: v,
                    engine: 'RecallReach'
                });
            }
        });

        // Check all customers for Priority 2 and 3
        customers.forEach(c => {
            // MEDIUM (priority 2) - ServicePulse matches >= 6 for At Risk/Drifted
            if (c.churnScore >= 6 && (c.status === 'at-risk' || c.status === 'drifted')) {
                priorityActions.push({
                    priority: 2,
                    type: 'MEDIUM',
                    message: `Churn risk ${c.churnScore}/10 — send personalized follow-up`,
                    customer: c,
                    engine: 'ServicePulse'
                });
            }

            // OPPORTUNITY (priority 3) - TradeIQ matches >= 90 for Ready to Buy
            const recentContact = recentOutreach.some(o => o.customerId === c.id);

            if (c.purchaseLikelihoodScore >= 90 && c.status === 'active' && !recentContact) {
                priorityActions.push({
                    priority: 3,
                    type: 'OPPORTUNITY',
                    message: `Purchase score ${c.purchaseLikelihoodScore}/100 — ready to buy`,
                    customer: c,
                    engine: 'TradeIQ'
                });
            }

            // OPPORTUNITY (priority 3) - TradeIQ Upsells Detected (occurring today)
            const hasTodayUpsells = todaysJobs.some(job =>
                job.customerId === c.id &&
                job.upsellOpportunities &&
                job.upsellOpportunities !== '[]' &&
                JSON.parse(job.upsellOpportunities).length > 0
            );

            if (hasTodayUpsells && c.purchaseLikelihoodScore > 80 && !recentContact) {
                priorityActions.push({
                    priority: 3,
                    type: 'OPPORTUNITY',
                    message: `Service upsell detected — upgrade potential`,
                    customer: c,
                    engine: 'TradeIQ'
                });
            }
        });

        // Sort by priority (0 is highest). If tied, push highest churn score to the top
        priorityActions.sort((a, b) => {
            if (a.priority !== b.priority) {
                return a.priority - b.priority;
            }
            // Secondary sort: High Churn Score wins
            const scoreA = a.customer?.churnScore || 0;
            const scoreB = b.customer?.churnScore || 0;
            return scoreB - scoreA;
        });

        // Deduplicate by customerId AND engine so we show independent alerts per engine
        const seen = new Set();
        const dedupedActions = priorityActions.filter(action => {
            const signature = `${action.customer.id}-${action.engine}`;
            if (seen.has(signature)) return false;
            seen.add(signature);
            return true;
        });

        // Show all deduplicated priority actions
        priorityActions = dedupedActions;

        res.json({
            stats,
            priorityActions,
            recentOutreach
        });

    } catch (error) {
        console.error("Error in GET /dashboard:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
