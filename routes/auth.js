const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
    try {
        const { prenom, nom, username, password, niveau, specialite } = req.body;

        // Check existing
        const exist = await User.findOne({ username });
        if(exist) return res.json({ success: false, error: "User already exists" });

        const user = await User.create({ prenom, nom, username, password, niveau, specialite });
        res.json({ success: true, user: { id: user._id, username: user.username, role: user.role } });
    } catch(err) {
        console.log(err);
        res.json({ success: false, error: "Server error" });
    }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if(!user) return res.json({ success: false, error: "Invalid credentials" });

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.json({ success: false, error: "Invalid credentials" });

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, user: { id: user._id, prenom: user.prenom, nom: user.nom, username: user.username, role: user.role }, token });
    } catch(err) {
        console.log(err);
        res.json({ success: false, error: "Server error" });
    }
});

module.exports = router;
