const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { calculateChurnScore, getNextTouchpointDate, detectUpsellOpportunities } = require('../services/servicePulse');

// Route 1: GET /
router.get('/', async (req, res) => {
    try {
        const serviceJobs = await prisma.serviceJob.findMany({
            include: { customer: true, vehicle: true },
            orderBy: { serviceDate: 'desc' },
            take: 50
        });
        res.json(serviceJobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route 2: POST / (to log a new job & trigger AI)
router.post('/', async (req, res) => {
    try {
        const {
            customerId,
            vehicleId,
            serviceType,
            complaints,
            laborCost,
            partsCost,
            advisor
        } = req.body;

        const totalCost = (laborCost || 0) + (partsCost || 0);
        const nextServiceDate = getNextTouchpointDate(serviceType, new Date());

        // Pass notes to the generic Gemini upsell logic
        const opportunities = detectUpsellOpportunities(complaints || '');

        // Store opportunities as generic JSON string 
        const oppString = opportunities.length > 0 ? JSON.stringify(opportunities) : null;

        // Create newly minted job
        const job = await prisma.serviceJob.create({
            data: {
                customerId,
                vehicleId,
                serviceType,
                complaints,
                laborCost,
                partsCost,
                totalCost,
                advisor,
                upsellOpportunities: oppString,
                nextServiceDate
            }
        });

        // Automatically recalculate churn score since they just serviced the car
        const newChurnScore = await calculateChurnScore(customerId);

        res.json({
            success: true,
            job,
            newChurnScore,
            upsellOpportunities: opportunities
        });

    } catch (error) {
        console.error("Error in POST /service-jobs:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
