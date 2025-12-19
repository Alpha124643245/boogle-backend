const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// استدعاء Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const membreRoutes = require('./routes/membre');
const projectRoutes = require('./routes/projects');
const sessionRoutes = require('./routes/sessions');
const courseRoutes = require('./routes/courses');

const app = express();

// Middleware
app.use(cors({
  origin: ["https://boogle-front.vercel.app"], // رابط الـ Frontend متاعك
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json()); // باش نقدر نقراو JSON body

// Route test
app.get("/", (req, res) => {
  res.send("🚀 Boogle backend is running");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Routes
app.use('/api/auth', authRoutes);        // تسجيل الدخول و التسجيل
app.use('/api/admin', adminRoutes);      // routes الادمن فقط
app.use('/api/membre', membreRoutes);    // routes الممبر فقط
app.use('/api/projects', projectRoutes); // مشاريع الممبر
app.use('/api/sessions', sessionRoutes); // الجلسات / الكالندري
app.use('/api/courses', courseRoutes);

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
