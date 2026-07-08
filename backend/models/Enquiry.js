const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
  packageName: { type: String, default: '' },
  message: { type: String, default: '' },
  travelDate: { type: String, default: '' },
  travellers: { type: Number, default: 1 },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
