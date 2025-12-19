const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // الادمن
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
