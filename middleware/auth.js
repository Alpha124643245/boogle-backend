const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
    const { prenom, nom, username, password, niveau, specialite } = req.body;

    if(!prenom || !nom || !username || !password) {
        return res.status(400).json({ success: false, error: "Missing fields" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if(existingUser) return res.status(400).json({ success: false, error: "User already exists" });

        const newUser = await User.create({
            prenom,
            nom,
            username,
            password,
            niveau: niveau || "1",
            specialite: specialite || "",
            role: "membre"
        });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ success: true, token, user: newUser });
    } catch(err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) return res.status(400).json({ success: false, error: "Missing fields" });

    try {
        const user = await User.findOne({ username });
        if(!user) return res.status(400).json({ success: false, error: "Invalid credentials" });

        const isMatch = await user.matchPassword(password);
        if(!isMatch) return res.status(400).json({ success: false, error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token, user });
    } catch(err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

module.exports = router;
