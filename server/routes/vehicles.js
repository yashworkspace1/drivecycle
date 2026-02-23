const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const vehicles = await req.prisma.vehicle.findMany({
            include: { customer: true }
        });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
