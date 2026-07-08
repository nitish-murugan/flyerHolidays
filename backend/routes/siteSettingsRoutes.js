const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', protect, (req, res, next) => {
  req.uploadFolder = 'settings';
  next();
}, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'aboutImage', maxCount: 1 }]), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.files && req.files.logo) updateData.logo = `/uploads/settings/${req.files.logo[0].filename}`;
    if (req.files && req.files.aboutImage) updateData.aboutImage = `/uploads/settings/${req.files.aboutImage[0].filename}`;
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(updateData);
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, updateData, { new: true });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
