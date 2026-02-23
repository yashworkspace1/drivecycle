const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Inject Prisma into requests
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// Import Routes
app.use('/api/customers', require('./routes/customers'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/service-jobs', require('./routes/serviceJobs'));
// Note: We mount recalls, tradeiq and outreach slightly differently based on user requirements.
// The route files themselves should handle the sub-paths (/active, /notify/:vehicleId, etc.)
app.use('/api/recalls', require('./routes/recalls'));
app.use('/api/tradeiq', require('./routes/tradeiq'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/outreach', require('./routes/outreach'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', engine: 'DriveCycle API' });
});

app.listen(PORT, () => {
    console.log(`DriveCycle server running on port ${PORT}`);
});

// Graceful error handling for unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Optionally: process.exit(1);
});
