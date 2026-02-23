const express = require('express');
const router = express.Router();
const axios = require('axios');

// ──────────────────────────────────────────────
// Demo dealer data (no Dealer model in schema)
// ──────────────────────────────────────────────
const DEMO_DEALERS = [
    {
        id: 'dealer_1',
        fullName: 'Sarah Mitchell',
        email: 'sarah@drivecyclemotors.com',
        dealershipName: 'DriveCycle Motors',
        city: 'Austin',
        country: 'United States',
        plan: 'full',
        createdAt: new Date('2025-09-15')
    }
];

// ──────────────────────────────────────────────
// Route 1: GET /api/admin/overview
// ──────────────────────────────────────────────
router.get('/overview', async (req, res) => {
    try {
        const prisma = req.prisma;
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const [
            customers,
            vehicles,
            recalls,
            serviceJobs,
            allOutreach,
            todayOutreach
        ] = await Promise.all([
            prisma.customer.findMany({ include: { vehicles: true } }),
            prisma.vehicle.findMany({ include: { recalls: true, customer: true } }),
            prisma.recall.findMany({
                include: { vehicle: { include: { customer: true } } },
                orderBy: { detectedAt: 'desc' }
            }),
            prisma.serviceJob.findMany({ orderBy: { serviceDate: 'desc' } }),
            prisma.outreachLog.findMany({
                include: { customer: true },
                orderBy: { sentAt: 'desc' },
                take: 20
            }),
            prisma.outreachLog.findMany({
                where: { sentAt: { gte: startOfToday } }
            })
        ]);

        const dealers = DEMO_DEALERS;

        res.json({
            platform: {
                totalDealers: dealers.length,
                activeDealers: dealers.length,
                totalCustomers: customers.length,
                totalVehicles: vehicles.length,
                totalServiceJobs: serviceJobs.length,
                avgCustomersPerDealer: Math.round(customers.length / (dealers.length || 1))
            },

            aiActivity: {
                messagesToday: todayOutreach.length,
                totalMessages: allOutreach.length,
                byType: {
                    servicepulse: todayOutreach.filter(o => o.type === 'servicepulse').length,
                    recallreach: todayOutreach.filter(o => o.type === 'recallreach').length,
                    tradeiq: todayOutreach.filter(o => o.type === 'tradeiq').length
                },
                successRate: Math.round(
                    (allOutreach.filter(o => o.status === 'sent' || o.status === 'delivered' || o.status === 'replied').length
                        / (allOutreach.length || 1)) * 100
                ),
                recentMessages: allOutreach.slice(0, 10).map(o => ({
                    id: o.id,
                    customerName: o.customer.name,
                    type: o.type,
                    message: o.message,
                    status: o.status,
                    sentAt: o.sentAt
                }))
            },

            recallMonitor: {
                totalRecalls: recalls.length,
                byStatus: {
                    pending: recalls.filter(r => r.status === 'pending').length,
                    notified: recalls.filter(r => r.status === 'notified').length,
                    scheduled: recalls.filter(r => r.status === 'scheduled').length,
                    completed: recalls.filter(r => r.status === 'completed').length
                },
                bySeverity: {
                    critical: recalls.filter(r => r.severity === 'critical').length,
                    high: recalls.filter(r => r.severity === 'high').length,
                    medium: recalls.filter(r => r.severity === 'medium').length,
                    low: recalls.filter(r => r.severity === 'low').length
                },
                criticalUnnotified: recalls
                    .filter(r => r.severity === 'critical' && r.status === 'pending')
                    .map(r => ({
                        id: r.id,
                        vehicleId: r.vehicleId,
                        recallId: r.recallId,
                        component: r.component,
                        severity: r.severity,
                        customerName: r.vehicle?.customer?.name || 'Unknown',
                        vehicleName: `${r.vehicle?.year} ${r.vehicle?.make} ${r.vehicle?.model}`,
                        detectedAt: r.detectedAt,
                        daysPending: Math.floor((new Date() - new Date(r.detectedAt)) / (1000 * 60 * 60 * 24))
                    }))
            },

            customerHealth: {
                byStatus: {
                    active: customers.filter(c => c.status === 'active').length,
                    atRisk: customers.filter(c => c.status === 'at-risk').length,
                    drifted: customers.filter(c => c.status === 'drifted').length,
                    recovered: customers.filter(c => c.status === 'recovered').length
                },
                avgChurnScore: parseFloat(
                    (customers.reduce((sum, c) => sum + c.churnScore, 0) / (customers.length || 1)).toFixed(1)
                ),
                avgPurchaseScore: parseFloat(
                    (customers.reduce((sum, c) => sum + c.purchaseLikelihoodScore, 0) / (customers.length || 1)).toFixed(1)
                ),
                hotLeads: customers.filter(c => c.purchaseLikelihoodScore >= 75).length,
                avgLifetimeSpend: Math.round(
                    customers.reduce((sum, c) => sum + c.totalLifetimeSpend, 0) / (customers.length || 1)
                )
            },

            dealers: dealers.map(d => ({
                id: d.id,
                fullName: d.fullName,
                email: d.email,
                dealershipName: d.dealershipName,
                city: d.city,
                country: d.country,
                plan: d.plan,
                createdAt: d.createdAt,
                customerCount: customers.length
            }))
        });
    } catch (err) {
        console.error('Admin overview error:', err);
        res.status(500).json({ error: 'Failed to fetch admin overview' });
    }
});

// ──────────────────────────────────────────────
// Route 2: GET /api/admin/recalls
// ──────────────────────────────────────────────
router.get('/recalls', async (req, res) => {
    try {
        const prisma = req.prisma;
        const recalls = await prisma.recall.findMany({
            include: { vehicle: { include: { customer: true } } },
            orderBy: [{ detectedAt: 'desc' }]
        });

        // Custom sort: critical first, then high, medium, low
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        recalls.sort((a, b) => (severityOrder[a.severity] || 99) - (severityOrder[b.severity] || 99));

        res.json(recalls.map(r => ({
            id: r.id,
            recallId: r.recallId,
            component: r.component,
            summary: r.summary,
            consequence: r.consequence,
            severity: r.severity,
            status: r.status,
            detectedAt: r.detectedAt,
            notifiedAt: r.notifiedAt,
            daysPending: Math.floor((new Date() - new Date(r.detectedAt)) / (1000 * 60 * 60 * 24)),
            vehicle: {
                id: r.vehicle?.id,
                year: r.vehicle?.year,
                make: r.vehicle?.make,
                model: r.vehicle?.model,
                mileage: r.vehicle?.mileage,
                vin: r.vehicle?.vin
            },
            customer: {
                name: r.vehicle?.customer?.name,
                phone: r.vehicle?.customer?.phone,
                email: r.vehicle?.customer?.email,
                status: r.vehicle?.customer?.status
            }
        })));
    } catch (err) {
        console.error('Admin recalls error:', err);
        res.status(500).json({ error: 'Failed to fetch recalls' });
    }
});

// ──────────────────────────────────────────────
// Route 3: GET /api/admin/messages
// ──────────────────────────────────────────────
router.get('/messages', async (req, res) => {
    try {
        const prisma = req.prisma;
        const { type, status, limit } = req.query;

        const where = {};
        if (type && type !== 'all') where.type = type;
        if (status && status !== 'all') where.status = status;

        const [messages, total] = await Promise.all([
            prisma.outreachLog.findMany({
                where,
                include: { customer: true },
                orderBy: { sentAt: 'desc' },
                take: parseInt(limit) || 50
            }),
            prisma.outreachLog.count({ where })
        ]);

        res.json({
            messages: messages.map(m => ({
                id: m.id,
                type: m.type,
                channel: m.channel,
                message: m.message,
                status: m.status,
                sentAt: m.sentAt,
                twilioSid: m.twilioSid,
                customerName: m.customer.name,
                customerPhone: m.customer.phone
            })),
            total
        });
    } catch (err) {
        console.error('Admin messages error:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// ──────────────────────────────────────────────
// Route 4: GET /api/admin/dealers
// ──────────────────────────────────────────────
router.get('/dealers', async (req, res) => {
    try {
        const prisma = req.prisma;

        const [customers, vehicles, recalls, outreach] = await Promise.all([
            prisma.customer.count(),
            prisma.vehicle.count(),
            prisma.recall.count({ where: { status: 'pending' } }),
            prisma.outreachLog.count(),
        ]);

        const hotLeads = await prisma.customer.count({
            where: { purchaseLikelihoodScore: { gte: 75 } }
        });

        res.json(DEMO_DEALERS.map(d => ({
            id: d.id,
            fullName: d.fullName,
            email: d.email,
            dealershipName: d.dealershipName,
            city: d.city,
            country: d.country,
            plan: d.plan,
            createdAt: d.createdAt,
            stats: {
                customers,
                vehicles,
                activeRecalls: recalls,
                messagesSent: outreach,
                hotLeads
            }
        })));
    } catch (err) {
        console.error('Admin dealers error:', err);
        res.status(500).json({ error: 'Failed to fetch dealers' });
    }
});

// ──────────────────────────────────────────────
// Route 5: GET /api/admin/system-health
// ──────────────────────────────────────────────
router.get('/system-health', async (req, res) => {
    try {
        const prisma = req.prisma;

        // Database check
        let database;
        try {
            const dbStart = Date.now();
            await prisma.$queryRaw`SELECT 1`;
            database = { status: 'healthy', latency: Date.now() - dbStart };
        } catch {
            database = { status: 'error', latency: null };
        }

        // NHTSA API check
        let nhtsa;
        try {
            const nhtsaStart = Date.now();
            await axios.get('https://api.nhtsa.gov/recalls/recallsByVehicle', {
                params: { make: 'Ford', model: 'F-150', modelYear: 2019 },
                timeout: 5000
            });
            nhtsa = { status: 'healthy', latency: Date.now() - nhtsaStart };
        } catch {
            nhtsa = { status: 'error', latency: null };
        }

        // Gemini AI check
        let gemini;
        try {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            if (!process.env.GEMINI_API_KEY) {
                gemini = { status: 'not_configured' };
            } else {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
                const result = await model.generateContent('Respond with only the word OK');
                gemini = { status: result ? 'healthy' : 'error' };
            }
        } catch (err) {
            console.error('Gemini health check error:', err.message);
            gemini = { status: err.message?.includes('429') ? 'rate_limited' : 'error' };
        }

        // Twilio check
        const twilio = {
            status: process.env.TWILIO_ACCOUNT_SID ? 'configured' : 'not_configured'
        };

        // Database record counts
        const [dealers, customers, vehicles, recalls, serviceJobs, outreachLogs] = await Promise.all([
            Promise.resolve(DEMO_DEALERS.length),
            prisma.customer.count(),
            prisma.vehicle.count(),
            prisma.recall.count(),
            prisma.serviceJob.count(),
            prisma.outreachLog.count()
        ]);

        res.json({
            services: { database, nhtsa, gemini, twilio },
            database: { dealers, customers, vehicles, recalls, serviceJobs, outreachLogs },
            environment: {
                nodeVersion: process.version,
                uptime: Math.floor(process.uptime()),
                memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
            }
        });
    } catch (err) {
        console.error('System health error:', err);
        res.status(500).json({ error: 'Failed to run system health check' });
    }
});

module.exports = router;
