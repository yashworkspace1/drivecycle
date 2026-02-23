const twilio = require('twilio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE;

// Initialize Twilio client only if credentials exist
let client;
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

async function mockSend({ to, message, customerId, type }) {
    console.log(`[MOCK SMS] To: ${to} | Msg: ${message}`);

    await prisma.outreachLog.create({
        data: {
            customerId,
            type,
            channel: 'sms',
            message,
            status: 'sent',
            // No twilioSid
        }
    });

    return { success: true, sid: 'mock_sid', message };
}

async function sendSMS({ to, message, customerId, type }) {
    // Use mock if Twilio is not configured, or if we are texting fake test numbers (555 area code)
    if (!client || to.includes('555')) {
        return mockSend({ to, message, customerId, type });
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: fromPhone,
            to: to
        });

        await prisma.outreachLog.create({
            data: {
                customerId,
                type,
                channel: 'sms',
                message,
                status: 'sent',
                twilioSid: result.sid
            }
        });

        return { success: true, sid: result.sid, message };
    } catch (error) {
        console.error("Twilio Error:", error);

        await prisma.outreachLog.create({
            data: {
                customerId,
                type,
                channel: 'sms',
                message,
                status: 'failed'
            }
        });

        return { success: false, error: error.message, message };
    }
}

module.exports = {
    sendSMS
};
