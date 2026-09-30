const express = require('express');
const Queue = require('../models/Queue');
const Token = require('../models/Token');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

async function joinQueueUnsafe(req, res) {
    try {
        const { queueId, priorityClass } = req.body;

        const queue = await Queue.findById(queueId);
        if (!queue || !queue.isActive) {
            return res.status(404).json({ error: 'Queue not found or inactive' });
        }
        const nextTokenNumber = queue.lastTokenNumber + 1;

        await new Promise((resolve) => setTimeout(resolve, 50));

        queue.lastTokenNumber = nextTokenNumber;
        await queue.save();

        const token = await Token.create({
            tokenNumber: nextTokenNumber,
            queueId,
            userId: req.user.id,
            priorityClass: priorityClass || 'normal',
        });
        res.status(201).json({ token });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Duplicate token number (race condition hit)' });
        }
        res.status(500).json({ error: 'Failed to join queue', details: err.message });
    }
}


async function joinQueueSafe(req, res) {
    try {
        const { queueId, priorityClass } = req.body;

        const queue = await Queue.findOneAndUpdate(
            { _id: queueId, isActive: true },
            { $inc: { lastTokenNumber: 1 } },
            { new: true },
        );
        if (!queue) {
            return res.status(404).json({ error: 'Queue not found or inactive' });
        }

        const token = await Token.create({
            tokenNumber: queue.lastTokenNumber,
            queueId,
            userId: req.user.id,
            priorityClass: priorityClass || 'normal',
        });
        res.status(201).json({ token });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Unexpected duplicate token number' });
        }
        res.status(500).json({ error: 'Failed to join queue', details: err.message });
    }
}

router.post('/join', authenticate, (req, res) => {
    if (process.env.USE_UNSAFE_JOIN === 'true') {
        return joinQueueUnsafe(req, res);
    }
    return joinQueueSafe(req, res);
});

router.get('/mine', authenticate, async (req, res) => {
    const tokens = await Token.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ tokens });
});

module.exports = router;