const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET active gallery (public)
router.get('/', async (req, res) => {
  try {
    const photos = await Gallery.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all gallery (admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add gallery photo (admin)
router.post('/', protect, (req, res, next) => {
  req.uploadFolder = 'gallery';
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const { caption, location, customerName, order } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });
    const photo = await Gallery.create({
      image: `/uploads/gallery/${req.file.filename}`,
      caption, location, customerName, order: order || 0,
    });
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update gallery photo (admin)
router.put('/:id', protect, (req, res, next) => {
  req.uploadFolder = 'gallery';
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const { caption, location, customerName, order, isActive } = req.body;
    const updateData = { caption, location, customerName, order, isActive };
    if (req.file) updateData.image = `/uploads/gallery/${req.file.filename}`;
    const photo = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE gallery photo (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
