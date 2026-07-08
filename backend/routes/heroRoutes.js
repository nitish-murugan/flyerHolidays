const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET active hero banners (public)
router.get('/', async (req, res) => {
  try {
    const banners = await Hero.find({ isActive: true }).sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all hero banners (admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const banners = await Hero.find().sort({ order: 1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add hero banner (admin)
router.post('/', protect, (req, res, next) => {
  req.uploadFolder = 'hero';
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, order } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    const banner = await Hero.create({
      image: `/uploads/hero/${req.file.filename}`,
      title, subtitle, order: order || 0,
    });
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update hero banner (admin)
router.put('/:id', protect, (req, res, next) => {
  req.uploadFolder = 'hero';
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const { title, subtitle, order, isActive } = req.body;
    const updateData = { title, subtitle, order, isActive };
    if (req.file) updateData.image = `/uploads/hero/${req.file.filename}`;
    const banner = await Hero.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE hero banner (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Hero.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
