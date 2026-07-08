const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  happyTravellers: { type: Number, default: 5000 },
  toursCompleted: { type: Number, default: 500 },
  destinations: { type: Number, default: 50 },
  yearsExperience: { type: Number, default: 10 },
}, { timestamps: true });

module.exports = mongoose.model('Stats', statsSchema);
