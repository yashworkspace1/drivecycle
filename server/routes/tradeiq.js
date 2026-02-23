const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { estimateTradeValue, calculatePurchaseLikelihood } = require('../services/tradeiq');
const { generateTradeMessage } = require('../services/aiMessaging');
const { sendSMS } = require('../services/messaging');

// Helper to calculate this year's repair spend
function getThisYearRepairSpend(serviceJobs) {
    if (!serviceJobs || serviceJobs.length === 0) return 0;
    const currentYear = new Date().getFullYear();
    return serviceJobs
        .filter(job => new Date(job.serviceDate).getFullYear() === currentYear)
        .reduce((sum, job) => sum + (job.totalCost || 0), 0);
}

// Route 1: GET /hot-leads
router.get('/hot-leads', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                OR: [
                    { purchaseLikelihoodScore: { gte: 60 } },
                    {
                        serviceJobs: {
                            some: {
                                NOT: [
                                    { upsellOpportunities: null },
                                    { upsellOpportunities: '[]' },
                                    { upsellOpportunities: '' }
                                ]
                            }
                        }
                    }
                ]
            },
            include: {
                vehicles: true,
                serviceJobs: {
                    orderBy: { serviceDate: 'desc' } // Gets latest job first
                }
            },
            orderBy: {
                purchaseLikelihoodScore: 'desc'
            }
        });

        const results = customers.map(customer => {
            const vehicle = customer.vehicles && customer.vehicles.length > 0 ? customer.vehicles[0] : null;
            let valuation = null;

            if (vehicle) {
                valuation = estimateTradeValue(vehicle);
            }

            const repairSpendThisYear = getThisYearRepairSpend(customer.serviceJobs);

            const hasUpsell = customer.purchaseLikelihoodScore > 80 && customer.serviceJobs.some(job =>
                job.upsellOpportunities &&
                job.upsellOpportunities !== '[]' &&
                JSON.parse(job.upsellOpportunities).length > 0
            );

            return {
                customer: {
                    id: customer.id,
                    name: customer.name,
                    phone: customer.phone,
                    status: customer.status,
                    score: customer.purchaseLikelihoodScore,
                    latestJob: customer.serviceJobs.length > 0 ? customer.serviceJobs[0] : null,
                    hasUpsell
                },
                vehicle,
                valuation,
                repairSpendThisYear
            };
        });

        res.json(results);
    } catch (error) {
        console.error("Error in GET /hot-leads:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route 2: POST /recalculate-all
router.post('/recalculate-all', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            include: {
                vehicles: { include: { recalls: true } },
                serviceJobs: true
            }
        });

        const updates = [];

        for (const customer of customers) {
            if (!customer.vehicles || customer.vehicles.length === 0) continue;

            const vehicle = customer.vehicles[0];
            const newScore = calculatePurchaseLikelihood(customer, vehicle, customer.serviceJobs);
            const valuation = estimateTradeValue(vehicle);

            await prisma.customer.update({
                where: { id: customer.id },
                data: {
                    purchaseLikelihoodScore: newScore,
                    tradeValueEstimate: valuation.tradeValueLow
                }
            });

            updates.push({
                customerId: customer.id,
                name: customer.name,
                oldScore: customer.purchaseLikelihoodScore,
                newScore: newScore,
                oldValue: customer.tradeValueEstimate,
                newValue: valuation.tradeValueLow
            });
        }

        res.json(updates);
    } catch (error) {
        console.error("Error in POST /recalculate-all:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route 3: POST /send-valuation/:customerId
router.post('/send-valuation/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                vehicles: true,
                serviceJobs: true
            }
        });

        if (!customer || !customer.vehicles || customer.vehicles.length === 0) {
            return res.status(404).json({ error: 'Customer or vehicle not found' });
        }

        const vehicle = customer.vehicles[0];
        const valuation = estimateTradeValue(vehicle);
        const repairSpendThisYear = getThisYearRepairSpend(customer.serviceJobs);

        const vehicleName = `${vehicle.make} ${vehicle.model}`;
        const vehicleAge = Math.max(0, new Date().getFullYear() - vehicle.year);

        const aiMessage = await generateTradeMessage({
            customerName: customer.name,
            vehicleName: vehicleName,
            vehicleAge: vehicleAge,
            tradeValueLow: valuation.tradeValueLow,
            tradeValueHigh: valuation.tradeValueHigh,
            repairSpendThisYear: repairSpendThisYear
        });

        const smsResult = await sendSMS({
            to: customer.phone,
            message: aiMessage,
            customerId: customer.id,
            type: 'tradeiq'
        });

        res.json({
            message: aiMessage,
            valuation: valuation,
            breakdown: valuation.breakdown,
            sent: smsResult
        });

    } catch (error) {
        console.error(`Error in POST /send-valuation/${req.params.customerId}:`, error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
