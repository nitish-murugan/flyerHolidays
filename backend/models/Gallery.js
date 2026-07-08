const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String, default: '' },
  location: { type: String, default: '' },
  customerName: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
