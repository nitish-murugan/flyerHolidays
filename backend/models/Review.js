const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: '' },
  avatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  package: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
