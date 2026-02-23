const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NHTSA_BASE_URL = 'https://api.nhtsa.gov/recalls/recallsByVehicle';

async function getRecallsByVehicle(make, model, year) {
    try {
        const response = await axios.get(NHTSA_BASE_URL, {
            params: {
                make,
                model,
                modelYear: year
            }
        });
        return response.data.results || [];
    } catch (error) {
        console.error(`Error fetching NHTSA recalls for ${year} ${make} ${model}:`, error.message);
        return [];
    }
}

function assessSeverity(recall) {
    const consequence = (recall.Consequence || '').toLowerCase();
    const summary = (recall.Summary || '').toLowerCase();
    const combined = consequence + ' ' + summary;

    if (combined.includes('crash') || combined.includes('fire') || combined.includes('death') || combined.includes('injury')) {
        return 'critical';
    } else if (combined.includes('loss of control') || combined.includes('brake failure') || combined.includes('steering')) {
        return 'high';
    } else if (combined.includes('stall') || combined.includes('malfunction') || combined.includes('fail')) {
        return 'medium';
    }
    return 'low';
}

async function scanAllCustomerVehicles() {
    console.log('Starting NHTSA recall scan across all customer vehicles...');
    const vehicles = await prisma.vehicle.findMany({
        include: { customer: true }
    });

    let scanned = 0;
    let newRecallsFound = 0;
    let vehiclesAffected = new Set();

    for (const vehicle of vehicles) {
        if (!vehicle.make || !vehicle.model) continue;

        scanned++;
        const recallsData = await getRecallsByVehicle(vehicle.make, vehicle.model, vehicle.year);

        for (const apiRecall of recallsData) {
            if (!apiRecall.NHTSACampaignNumber) continue;

            // Check if this specific recallId already exists for this vehicle
            const existingRecall = await prisma.recall.findFirst({
                where: {
                    vehicleId: vehicle.id,
                    recallId: apiRecall.NHTSACampaignNumber
                }
            });

            if (!existingRecall) {
                // It's a NEW recall for this vehicle
                await prisma.recall.create({
                    data: {
                        vehicleId: vehicle.id,
                        recallId: apiRecall.NHTSACampaignNumber,
                        component: apiRecall.Component || 'Unknown Component',
                        summary: apiRecall.Summary || 'No summary provided.',
                        consequence: apiRecall.Consequence,
                        severity: assessSeverity(apiRecall),
                        status: 'pending'
                    }
                });

                newRecallsFound++;
                vehiclesAffected.add(vehicle.id);
            }
        }

        // 300ms delay to respect NHTSA rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    return {
        scanned,
        newRecallsFound,
        vehiclesAffected: Array.from(vehiclesAffected)
    };
}

function shouldIncludeTradeHook(customer, vehicle) {
    if (!customer || !vehicle) return false;
    return vehicle.year <= 2020 && customer.purchaseLikelihoodScore >= 65;
}

module.exports = {
    getRecallsByVehicle,
    assessSeverity,
    scanAllCustomerVehicles,
    shouldIncludeTradeHook
};
