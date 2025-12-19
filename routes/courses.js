const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Course = require('../models/Course');

// جميع الكورسات - ميمبر ومشتركين
router.get('/', protect, async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

// إضافة كورس - ادمن فقط
router.post('/', protect, adminOnly, async (req, res) => {
    const { title, description, link } = req.body;
    const course = new Course({ title, description, link, createdBy: req.user._id });
    await course.save();
    res.json({ success: true, course });
});

// تعديل كورس - ادمن فقط
router.put('/:id', protect, adminOnly, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(404).json({ success: false, error: "Course not found" });

    const { title, description, link } = req.body;
    if(title) course.title = title;
    if(description) course.description = description;
    if(link) course.link = link;

    await course.save();
    res.json({ success: true, course });
});

// حذف كورس - ادمن فقط
router.delete('/:id', protect, adminOnly, async (req, res) => {
    const course = await Course.findById(req.params.id);
    if(!course) return res.status(404).json({ success: false, error: "Course not found" });

    await course.remove();
    res.json({ success: true, message: "Course deleted" });
});

module.exports = router;
