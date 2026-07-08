const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET active reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true }).sort({ isFeatured: -1, createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all reviews (admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add review (admin)
router.post('/', protect, (req, res, next) => {
  req.uploadFolder = 'reviews';
  next();
}, upload.single('avatar'), async (req, res) => {
  try {
    const { name, location, rating, review, package: pkg, isFeatured } = req.body;
    const avatar = req.file ? `/uploads/reviews/${req.file.filename}` : '';
    const newReview = await Review.create({
      name, location, rating: Number(rating), review,
      package: pkg, avatar, isFeatured: isFeatured === 'true',
    });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update review (admin)
router.put('/:id', protect, (req, res, next) => {
  req.uploadFolder = 'reviews';
  next();
}, upload.single('avatar'), async (req, res) => {
  try {
    const { name, location, rating, review, package: pkg, isFeatured, isActive } = req.body;
    const updateData = { name, location, rating: Number(rating), review, package: pkg, isFeatured: isFeatured === 'true', isActive: isActive !== 'false' };
    if (req.file) updateData.avatar = `/uploads/reviews/${req.file.filename}`;
    const updated = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE review (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
