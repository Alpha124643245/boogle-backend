const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Project = require('../models/Project');
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

// ===== بيانات الممبر =====

// جلب بيانات الممبر الحالي
router.get('/me', protect, async (req, res) => {
    res.json({ success: true, user: req.user });
});

// تعديل بيانات الممبر الحالي (prenom, nom, niveau, specialite, password)
router.put('/me', protect, async (req, res) => {
    try {
        const { prenom, nom, niveau, specialite, password } = req.body;
        const user = await User.findById(req.user._id);
        if(!user) return res.status(404).json({ success: false, error: "User not found" });

        if(prenom) user.prenom = prenom;
        if(nom) user.nom = nom;
        if(niveau) user.niveau = niveau;
        if(specialite) user.specialite = specialite;
        if(password) user.password = password; // pre-save middleware باش يعمل hash

        await user.save();
        res.json({ success: true, user });
    } catch(err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// ===== Projects =====

// رفع مشروع جديد
router.post('/projects', protect, upload.single('file'), async (req, res) => {
    const { title, description } = req.body;
    const file = req.file ? req.file.filename : null;

    const project = await Project.create({
        title,
        description,
        file,
        owner: req.user._id
    });

    res.json({ success: true, project });
});

// جلب كل المشاريع الخاصة بالممبر
router.get('/projects', protect, async (req, res) => {
    const projects = await Project.find({ owner: req.user._id });
    res.json({ success: true, projects });
});

// حذف مشروع الممبر الخاص
router.delete('/projects/:id', protect, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if(!project) return res.status(404).json({ success: false, error: "Project not found" });

    if(project.owner.toString() !== req.user._id.toString())
        return res.status(403).json({ success: false, error: "Not authorized" });

    await project.remove();
    res.json({ success: true, message: "Project deleted" });
});

module.exports = router;
