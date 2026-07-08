const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
