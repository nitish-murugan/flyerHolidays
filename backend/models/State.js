const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);
