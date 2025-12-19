const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    link: { type: String, default: "" }, // رابط الملف أو الفيديو
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // الادمن الي زاد الكورس
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
