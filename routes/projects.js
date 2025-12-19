const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');

// Upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// اضافة مشروع (الممبر)
router.post('/', protect, upload.single('fichier'), async (req, res) => {
    const { titre, description } = req.body;
    const fichier = req.file ? req.file.path : null;

    const project = new Project({
        titre,
        description,
        fichier,
        createdBy: req.user._id
    });
    await project.save();
    res.json({ success: true, project });
});

// رؤية كل المشاريع الخاصة بالمستخدم
router.get('/me', protect, async (req, res) => {
    const projects = await Project.find({ createdBy: req.user._id });
    res.json(projects);
});

// رؤية كل المشاريع (admin فقط)
router.get('/', protect, async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

// حذف مشروع
router.delete('/:id', protect, async (req, res) => {
    const project = await Project.findById(req.params.id);
    if(!project) return res.status(404).json({ success: false, error: "Project not found" });

    if(req.user.role !== 'admin' && !project.createdBy.equals(req.user._id))
        return res.status(403).json({ success: false, error: "Not allowed" });

    await project.remove();
    res.json({ success: true, message: "Project deleted" });
});

module.exports = router;
