const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
  duration: { type: String, required: true }, // e.g. "5D/4N"
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  images: [{ type: String }],
  highlights: [{ type: String }],
  description: { type: String, default: '' },
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  itinerary: [{ day: Number, title: String, description: String }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
