const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Session = require('../models/Session');

// اضافة جلسة (admin)
router.post('/', protect, adminOnly, async (req, res) => {
    const { titre, date, description } = req.body;
    const session = new Session({ titre, date, description, createdBy: req.user._id });
    await session.save();
    res.json({ success: true, session });
});

// رؤية كل الجلسات
router.get('/', protect, async (req, res) => {
    const sessions = await Session.find();
    res.json(sessions);
});

// حذف جلسة (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    const session = await Session.findById(req.params.id);
    if(!session) return res.status(404).json({ success: false, error: "Session not found" });

    await session.remove();
    res.json({ success: true, message: "Session deleted" });
});

module.exports = router;
