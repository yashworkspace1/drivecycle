const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-2.0-flash";

async function generateServicePulseMessage({
    customerName,
    vehicleInfo,
    lastServiceType,
    lastComplaint,
    advisorName,
    nextServiceDays,
    upsellOpportunity
}) {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: "You are a friendly service advisor at a car dealership texting a customer. Be warm, human, never corporate. Keep it under 160 characters. Reference their specific car and situation. End with an easy call to action."
        });

        const prompt = `
      Customer: ${customerName}
      Vehicle: ${vehicleInfo}
      Last Service: ${lastServiceType}
      Complaint/Notes from last visit: ${lastComplaint || 'None'}
      Advisor Name: ${advisorName}
      Days until next recommended service: ${nextServiceDays}
      Specific Upsell suggestion: ${upsellOpportunity ? upsellOpportunity.message : 'None'}
      
      Draft a text message to this customer.
    `;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Gemini Error in generateServicePulseMessage:", error);
        // Fallback template
        return `Hi ${customerName.split(' ')[0]}, it's ${advisorName} from service! Just checking in on your ${vehicleInfo}. Let me know if you need anything!`;
    }
}

async function generateRecallMessage({
    customerName,
    vehicleName,
    recallComponent,
    recallSummary,
    severity,
    includeTradeHook
}) {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: "You are a helpful service advisor texting about a vehicle recall. Be helpful not alarming. Mention it is FREE and covered by manufacturer. Keep under 160 characters. Sound human."
        });

        let prompt = `
      Customer: ${customerName}
      Vehicle: ${vehicleName}
      Recall Component: ${recallComponent}
      Summary: ${recallSummary}
      Severity: ${severity}. ${severity === 'critical' ? 'Be clear about the urgency.' : ''}
      ${includeTradeHook ? 'Include one sentence about a complimentary vehicle health check or appraisal.' : ''}
      
      Draft a text message letting them know about this recall.
    `;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Gemini Error in generateRecallMessage:", error);
        // Fallback template
        return `Hi ${customerName.split(' ')[0]}, we found a free safety recall for your ${vehicleName}. Please schedule an appointment with us to get it fixed!`;
    }
}

async function generateTradeMessage({
    customerName,
    vehicleName,
    vehicleAge,
    tradeValueLow,
    tradeValueHigh,
    repairSpendThisYear
}) {
    try {
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: "You are a transparent car dealer texting a loyal customer. Lead with their actual trade value number — never hide it. Sound like you are doing them a favor not selling to them. Under 160 characters. No buzzwords."
        });

        const prompt = `
      Customer: ${customerName}
      Vehicle: ${vehicleName} (${vehicleAge} years old)
      Estimated Trade Value: $${tradeValueLow} - $${tradeValueHigh}
      Repair spend this year: $${repairSpendThisYear}
      
      Draft a text message offering them this trade-in value based on their vehicle's age and recent repair costs.
    `;

        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("Gemini Error in generateTradeMessage:", error);
        // Fallback template
        return `Hi ${customerName.split(' ')[0]}, your ${vehicleName} is currently worth between $${tradeValueLow} and $${tradeValueHigh}. Contact us if you are interested in upgrading!`;
    }
}

module.exports = {
    generateServicePulseMessage,
    generateRecallMessage,
    generateTradeMessage
};
