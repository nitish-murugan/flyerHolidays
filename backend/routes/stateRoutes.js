const express = require('express');
const router = express.Router();
const State = require('../models/State');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET all states (public)
router.get('/', async (req, res) => {
  try {
    const states = await State.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all states for admin
router.get('/admin/all', protect, async (req, res) => {
  try {
    const states = await State.find().sort({ order: 1, createdAt: 1 });
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create state (admin)
router.post('/', protect, (req, res, next) => {
  req.uploadFolder = 'states';
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const { name, slug, description, order } = req.body;
    const image = req.file ? `/uploads/states/${req.file.filename}` : '';
    const state = await State.create({ name, slug, image, description, order: order || 0 });
    res.status(201).json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update state (admin)
router.put('/:id', protect, (req, res, next) => {
  req.uploadFolder = 'states';
  next();
}, upload.single('image'), async (req, res) => {
  try {
    const { name, slug, description, order, isActive } = req.body;
    const updateData = { name, slug, description, order, isActive };
    if (req.file) updateData.image = `/uploads/states/${req.file.filename}`;
    const state = await State.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(state);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE state (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await State.findByIdAndDelete(req.params.id);
    res.json({ message: 'State deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
