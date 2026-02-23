const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function calculateChurnScore(customerId) {
    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
            serviceJobs: {
                orderBy: { serviceDate: 'desc' },
            },
        },
    });

    if (!customer || !customer.serviceJobs || customer.serviceJobs.length === 0) {
        return 10;
    }

    const jobs = customer.serviceJobs;
    let score = 0;

    const lastJob = jobs[0];
    const now = new Date();
    const daysSinceService = Math.floor((now - new Date(lastJob.serviceDate)) / (1000 * 60 * 60 * 24));

    // Signal 1: Days since last service (max 3 points)
    if (daysSinceService > 180) {
        score += 3;
    } else if (daysSinceService > 90) {
        score += 2;
    } else if (daysSinceService > 60) {
        score += 1;
    }

    // Signal 2: Service frequency trend (max 2 points)
    if (jobs.length >= 3) {
        const j0Time = new Date(jobs[0].serviceDate).getTime();
        const j1Time = new Date(jobs[1].serviceDate).getTime();
        const j2Time = new Date(jobs[2].serviceDate).getTime();

        const gap1 = j0Time - j1Time;
        const gap2 = j1Time - j2Time;

        if (gap2 > 0) {
            if (gap1 > 1.5 * gap2) {
                score += 2;
            } else if (gap1 > 1.2 * gap2) {
                score += 1;
            }
        }
    }

    // Signal 3: High bill on last visit (max 2 points)
    if (lastJob.totalCost > 1000) {
        score += 2;
    } else if (lastJob.totalCost > 500) {
        score += 1;
    }

    // Signal 4: Repeat complaint keywords (max 2 points)
    if (jobs.length >= 2) {
        const keywords = ['noise', 'vibration', 'brake', 'ac', 'heat', 'leak', 'stall'];
        const comp0 = (jobs[0].complaints || '').toLowerCase();
        const comp1 = (jobs[1].complaints || '').toLowerCase();

        for (const kw of keywords) {
            if (comp0.includes(kw) && comp1.includes(kw)) {
                score += 2;
                break;
            }
        }
    }

    // Signal 5: No satisfaction rating logged (1 point)
    if (lastJob.satisfactionRating === null || lastJob.satisfactionRating === undefined) {
        score += 1;
    }

    // Cap at 10
    if (score > 10) score = 10;

    // Determine status
    let status = 'active';
    if (score >= 8 && daysSinceService > 120) {
        status = 'drifted';
    } else if (score >= 6) {
        status = 'at-risk';
    }

    // Update customer
    await prisma.customer.update({
        where: { id: customerId },
        data: { churnScore: score, status: status },
    });

    return score;
}

function getNextTouchpointDate(serviceType, serviceDate) {
    let days = 60; // default
    switch (serviceType) {
        case 'Oil Change':
            days = 85;
            break;
        case 'Brake Replacement':
        case 'Brake Inspection':
            days = 14;
            break;
        case 'AC Service':
            days = 21;
            break;
        case 'Tyre Rotation':
            days = 45;
            break;
        case 'Battery Check':
        case 'Battery Replacement':
            days = 30;
            break;
        case 'Full Service':
            days = 90;
            break;
    }

    const d = new Date(serviceDate);
    d.setDate(d.getDate() + days);
    return d;
}

function detectUpsellOpportunities(complaints) {
    if (!complaints) return [];
    const comp = complaints.toLowerCase();
    const opportunities = [];

    if (comp.includes('battery') && comp.includes('weak') && !comp.includes('replaced')) {
        opportunities.push({
            part: 'Battery Replacement',
            urgency: '30days',
            estimatedCost: 180,
            message: 'Battery tested weak...'
        });
    }

    if (comp.includes('brake pad') && !comp.includes('replaced')) {
        opportunities.push({
            part: 'Brake Pads',
            urgency: '60days',
            estimatedCost: 220,
            message: 'Brake pads noted...'
        });
    }

    if ((comp.includes('tyre') || comp.includes('tire')) && (comp.includes('worn') || comp.includes('40%') || comp.includes('30%'))) {
        opportunities.push({
            part: 'Tyre Set',
            urgency: '45days',
            estimatedCost: 400,
            message: 'Tyres showing wear...'
        });
    }

    if (comp.includes('air filter') && !comp.includes('replaced')) {
        opportunities.push({
            part: 'Air Filter',
            urgency: '30days',
            estimatedCost: 45,
            message: 'Air filter due...'
        });
    }

    return opportunities;
}

module.exports = {
    calculateChurnScore,
    getNextTouchpointDate,
    detectUpsellOpportunities
};
