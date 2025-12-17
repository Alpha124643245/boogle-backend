const mongoose = require("mongoose");

// إنشاء Schema للمستخدم
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// إنشاء الموديل من الSchema
module.exports = mongoose.model("User", UserSchema);
