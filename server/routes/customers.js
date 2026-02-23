const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const customers = await req.prisma.customer.findMany({
            include: {
                vehicles: true,
                serviceJobs: true,
            }
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const customer = await req.prisma.customer.findUnique({
            where: { id: req.params.id },
            include: {
                vehicles: true,
                serviceJobs: true,
                outreachLogs: true,
            }
        });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
