const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
    scanAllCustomerVehicles,
    getRecallsByVehicle,
    shouldIncludeTradeHook
} = require('../services/recallReach');

const { generateRecallMessage } = require('../services/aiMessaging');
const { sendSMS } = require('../services/messaging');

// Route 1: POST /scan-all
router.post('/scan-all', async (req, res) => {
    try {
        const summary = await scanAllCustomerVehicles();
        res.json(summary);
    } catch (error) {
        console.error("Error in POST /scan-all:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route 2: GET /active
router.get('/active', async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: {
                recalls: {
                    some: {
                        status: 'pending'
                    }
                }
            },
            include: {
                customer: true,
                recalls: {
                    where: {
                        status: 'pending'
                    }
                }
            },
            orderBy: {
                customer: {
                    purchaseLikelihoodScore: 'desc'
                }
            }
        });
        res.json(vehicles);
    } catch (error) {
        console.error("Error in GET /active:", error);
        res.status(500).json({ error: error.message });
    }
});

// Route 3: POST /notify/:vehicleId
router.post('/notify/:vehicleId', async (req, res) => {
    try {
        const { vehicleId } = req.params;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
            include: {
                customer: true,
                recalls: {
                    where: { status: 'pending' },
                    orderBy: { detectedAt: 'asc' } // Notify the oldest pending recall first
                }
            }
        });

        if (!vehicle || !vehicle.customer) {
            return res.status(404).json({ error: 'Vehicle or Customer not found' });
        }

        if (!vehicle.recalls || vehicle.recalls.length === 0) {
            return res.status(400).json({ error: 'No pending recalls found for this vehicle' });
        }

        const targetRecall = vehicle.recalls[0];
        const customer = vehicle.customer;

        const includeTradeHook = shouldIncludeTradeHook(customer, vehicle);

        const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

        const aiMessage = await generateRecallMessage({
            customerName: customer.name,
            vehicleName: vehicleName,
            recallComponent: targetRecall.component,
            recallSummary: targetRecall.summary,
            severity: targetRecall.severity,
            includeTradeHook: includeTradeHook
        });

        const smsResult = await sendSMS({
            to: customer.phone,
            message: aiMessage,
            customerId: customer.id,
            type: 'recallreach'
        });

        // Update the recall status
        await prisma.recall.update({
            where: { id: targetRecall.id },
            data: {
                status: 'notified',
                notifiedAt: new Date()
            }
        });

        // Re-engage customers who have drifted
        if (customer.status === 'drifted') {
            await prisma.customer.update({
                where: { id: customer.id },
                data: { status: 'at-risk' }
            });
        }

        res.json({
            message: aiMessage,
            includeTradeHook,
            smsSent: smsResult
        });

    } catch (error) {
        console.error(`Error in POST /notify/${req.params.vehicleId}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Route 4: GET /check/:vehicleId
router.get('/check/:vehicleId', async (req, res) => {
    try {
        const { vehicleId } = req.params;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });

        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        const rawRecalls = await getRecallsByVehicle(vehicle.make, vehicle.model, vehicle.year);

        res.json({
            vehicleInfo: vehicle,
            nhtsaResults: rawRecalls
        });

    } catch (error) {
        console.error(`Error in GET /check/${req.params.vehicleId}:`, error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
