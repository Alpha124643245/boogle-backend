// استدعاء المكتبات
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// إنشاء التطبيق
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔗 ربط MongoDB
mongoose
  .connect(
    "mongodb+srv://booglebeja:Laith2004@boogle.b25vpzh.mongodb.net/boogleDB"
  )
  .then(() => console.log("MongoDB connected 🌍"))
  .catch((err) => console.error("DB Error:", err));

// Route تجريبية
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});
const User = require("./models/User"); // استدعاء الموديل
const bcrypt = require("bcryptjs"); // لتشفير كلمة السر

// Route لتسجيل مستخدم جديد
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // نشوفو إذا المستخدم موجود
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // تشفير كلمة السر
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء مستخدم جديد
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save(); // تخزين في DB

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// PORT خاص بـ Render
const PORT = process.env.PORT || 3000;

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log("Server running");
});
