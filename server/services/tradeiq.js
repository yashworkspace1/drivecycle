function estimateTradeValue(vehicle) {
    const { make, model, year, mileage } = vehicle;
    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - year);

    // Base value lookup
    const baseValues = {
        'F-150': 42000,
        'Silverado': 40000,
        'Ram 1500': 38000,
        'Camry': 28000,
        'Accord': 27000,
        'Civic': 24000,
        'Corolla': 22000,
        'CR-V': 32000,
        'RAV4': 34000,
        'Escape': 28000,
        'Rogue': 30000,
        'Model 3': 45000,
        'Model Y': 52000,
        'Mustang': 35000
    };

    const base = baseValues[model] || 30000;

    // Depreciation by age
    let depreciation = 0;
    if (age === 1) depreciation = 0.15;
    else if (age === 2) depreciation = 0.25;
    else if (age === 3) depreciation = 0.34;
    else if (age === 4) depreciation = 0.42;
    else if (age === 5) depreciation = 0.49;
    else if (age === 6) depreciation = 0.55;
    else if (age >= 7) {
        depreciation = 0.55 + ((age - 6) * 0.07);
        if (depreciation > 0.85) depreciation = 0.85; // cap at 85%
    }

    // Mileage adjustment
    const averageMileage = age * 12000;
    let mileageAdjustment = 0;

    if (mileage > averageMileage) {
        const diff = mileage - averageMileage;
        mileageAdjustment = -(diff * 0.05); // subtract penalty
    } else if (mileage < averageMileage) {
        const diff = averageMileage - mileage;
        mileageAdjustment = diff * 0.03; // add bonus
    }

    // Final calculation
    let estimatedValue = (base * (1 - depreciation)) + mileageAdjustment;
    if (estimatedValue < 0) estimatedValue = 500; // Floor value

    const tradeValueLow = Math.round(estimatedValue * 0.88);
    const tradeValueHigh = Math.round(estimatedValue * 1.02);
    const privateValueLow = Math.round(estimatedValue * 1.05);
    const privateValueHigh = Math.round(estimatedValue * 1.18);

    const breakdown = {
        baseValue: base,
        age: age,
        depreciationFactor: depreciation,
        ageDepreciatedValue: Math.round(base * (1 - depreciation)),
        actualMileage: mileage,
        expectedMileage: averageMileage,
        mileageAdjustment: Math.round(mileageAdjustment),
        finalEstimatedBase: Math.round(estimatedValue)
    };

    return {
        tradeValueLow,
        tradeValueHigh,
        privateValueLow,
        privateValueHigh,
        breakdown
    };
}

function calculatePurchaseLikelihood(customer, vehicle, serviceJobs) {
    if (!customer || !vehicle) return 0;
    let score = 0;

    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - vehicle.year);

    // Signal 1 — Vehicle age (max 30 points)
    if (age >= 7) score += 30;
    else if (age >= 5) score += 22;
    else if (age >= 3) score += 10;

    // Signal 2 — Mileage (max 20 points)
    if (vehicle.mileage > 80000) score += 20;
    else if (vehicle.mileage > 60000) score += 14;
    else if (vehicle.mileage > 40000) score += 7;

    // Signal 3 — Repair spend this calendar year (max 20 points)
    let yearSpend = 0;
    if (serviceJobs && serviceJobs.length > 0) {
        yearSpend = serviceJobs
            .filter(job => new Date(job.serviceDate).getFullYear() === currentYear)
            .reduce((sum, job) => sum + (job.totalCost || 0), 0);
    }

    if (yearSpend > 2000) score += 20;
    else if (yearSpend > 1000) score += 12;
    else if (yearSpend > 500) score += 6;

    // Signal 4 — Time since purchase in days (max 15 points)
    if (customer.lastPurchaseDate) {
        const daysSincePurchase = Math.floor((new Date() - new Date(customer.lastPurchaseDate)) / (1000 * 60 * 60 * 24));
        if (daysSincePurchase > 2190) score += 15;
        else if (daysSincePurchase > 1460) score += 10;
        else if (daysSincePurchase > 730) score += 5;
    }

    // Signal 5 — Active recall on vehicle age > 4 (10 points)
    if (vehicle.recalls && vehicle.recalls.length > 0 && age > 4) {
        const hasActiveRecall = vehicle.recalls.some(r => r.status === 'pending');
        if (hasActiveRecall) score += 10;
    }

    // Signal 6 — High churn score (5 points)
    if (customer.churnScore >= 7) {
        score += 5;
    }

    return Math.min(score, 100);
}

module.exports = {
    estimateTradeValue,
    calculatePurchaseLikelihood
};
