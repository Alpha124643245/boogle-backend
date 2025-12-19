const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Calendar = require('../models/Calendar');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');

// ===== Multer setup للملفات =====
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// ===== USERS =====

// جلب كل المستخدمين
router.get('/users', protect, adminOnly, async (req, res) => {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
});

// تعديل بيانات المستخدم (الادمن فقط)
router.put('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const { prenom, nom, niveau, specialite } = req.body;
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ success: false, error: "User not found" });

        if(prenom) user.prenom = prenom;
        if(nom) user.nom = nom;
        if(niveau) user.niveau = niveau;
        if(specialite) user.specialite = specialite;

        await user.save();
        res.json({ success: true, user });
    } catch(err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// حذف مستخدم
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({ success: false, error: "User not found" });

    await user.remove();
    res.json({ success: true, message: "User deleted" });
});

// ===== PROJECTS =====

// جلب كل المشاريع
router.get('/projects', protect, adminOnly, async (req, res) => {
    const projects = await Project.find().populate('owner', '-password');
    res.json({ success: true, projects });
});

// حذف مشروع
router.delete('/projects/:id', protect, adminOnly, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if(!project) return res.status(404).json({ success: false, error: "Project not found" });

    await project.remove();
    res.json({ success: true, message: "Project deleted" });
});

// ===== CALENDAR =====

// اضافة حدث جديد
router.post('/calendar', protect, adminOnly, async (req, res) => {
    const { title, date } = req.body;
    const event = await Calendar.create({ title, date, createdBy: req.user._id });
    res.json({ success: true, event });
});

// حذف حدث
router.delete('/calendar/:id', protect, adminOnly, async (req, res) => {
    const event = await Calendar.findById(req.params.id);
    if(!event) return res.status(404).json({ success: false, error: "Event not found" });

    await event.remove();
    res.json({ success: true, message: "Event deleted" });
});

// جلب كل الأحداث
router.get('/calendar', protect, adminOnly, async (req, res) => {
    const events = await Calendar.find().populate('createdBy', '-password');
    res.json({ success: true, events });
});

module.exports = router;
