const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Flyer Holidays' },
  tagline: { type: String, default: 'Explore. Dream. Discover.' },
  phone: { type: String, default: '+91 98765 43210' },
  email: { type: String, default: 'info@flyerholidays.com' },
  address: { type: String, default: 'Chennai, Tamil Nadu, India' },
  whatsapp: { type: String, default: '+919876543210' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  formsphereId: { type: String, default: '' },
  aboutTitle: { type: String, default: 'About Flyer Holidays' },
  aboutDescription: { type: String, default: '' },
  aboutImage: { type: String, default: '' },
  logo: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
