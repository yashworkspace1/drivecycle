const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { generateServicePulseMessage, generateRecallMessage, generateTradeMessage } = require('../services/aiMessaging');
const { sendSMS } = require('../services/messaging');

// GENERATE only — no SMS sent
router.post('/generate', async (req, res) => {
    try {
        const { customerId, type } = req.body;

        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                vehicles: { include: { recalls: true } },
                serviceJobs: { orderBy: { serviceDate: 'desc' }, take: 3 }
            }
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const vehicle = customer.vehicles[0];
        const lastJob = customer.serviceJobs[0];
        let message = '';

        if (type === 'servicepulse') {
            message = await generateServicePulseMessage({
                customerName: customer.name.split(' ')[0],
                vehicleInfo: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'your vehicle',
                lastServiceType: lastJob?.serviceType || 'Service',
                lastComplaint: lastJob?.complaints || 'None',
                advisorName: lastJob?.advisor || 'Service Team',
                nextServiceDays: 30,
                upsellOpportunity: lastJob?.upsellOpportunities ? JSON.parse(lastJob.upsellOpportunities)[0] : null
            });
        }

        if (type === 'recallreach' && vehicle) {
            const recall = vehicle.recalls.find(r => r.status === 'pending');
            message = await generateRecallMessage({
                customerName: customer.name.split(' ')[0],
                vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                recallComponent: recall?.component,
                recallSummary: recall?.summary,
                severity: recall?.severity,
                includeTradeHook: customer.purchaseLikelihoodScore >= 65
            });
        }

        if (type === 'tradeiq' && vehicle) {
            const { estimateTradeValue } = require('../services/tradeiq');
            const valuation = estimateTradeValue(vehicle);
            const currentYear = new Date().getFullYear();
            const thisYearSpend = customer.serviceJobs
                .filter(j => new Date(j.serviceDate).getFullYear() === currentYear)
                .reduce((sum, j) => sum + (j.totalCost || 0), 0);

            message = await generateTradeMessage({
                customerName: customer.name.split(' ')[0],
                vehicleName: `${vehicle.make} ${vehicle.model}`,
                vehicleAge: Math.max(0, currentYear - vehicle.year),
                tradeValueLow: valuation.tradeValueLow,
                tradeValueHigh: valuation.tradeValueHigh,
                repairSpendThisYear: thisYearSpend
            });
        }

        res.json({ message });
    } catch (error) {
        console.error("Error generating message:", error);
        res.status(500).json({ error: error.message });
    }
});

// SEND — called after user confirms preview
router.post('/send', async (req, res) => {
    try {
        const { customerId, message, type } = req.body;
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: { vehicles: { include: { recalls: true } } }
        });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const result = await sendSMS({
            to: customer.phone,
            message,
            customerId,
            type
        });

        if (type === 'recallreach') {
            const vehicle = customer.vehicles[0];
            if (vehicle) {
                const targetRecall = vehicle.recalls.find(r => r.status === 'pending');
                if (targetRecall) {
                    await prisma.recall.update({
                        where: { id: targetRecall.id },
                        data: { status: 'notified', notifiedAt: new Date() }
                    });
                }
            }
            if (customer.status === 'drifted') {
                await prisma.customer.update({
                    where: { id: customer.id },
                    data: { status: 'at-risk' }
                });
            }
        }

        if (type === 'tradeiq') {
            const newScore = Math.min(100, (customer.purchaseLikelihoodScore || 0) + 10);
            await prisma.customer.update({
                where: { id: customer.id },
                data: { purchaseLikelihoodScore: newScore }
            });
        }

        res.json(result);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
