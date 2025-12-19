const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    niveau: { type: String, default: "1" },
    specialite: { type: String, default: "" },
    role: { type: String, enum: ["membre", "admin"], default: "membre" }
}, { timestamps: true });

// Hash password قبل الحفظ
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
