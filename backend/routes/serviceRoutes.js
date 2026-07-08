const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/authMiddleware');

// GET active services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all services (admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add service (admin)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, icon, order } = req.body;
    const service = await Service.create({ title, description, icon, order: order || 0 });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update service (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE service (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
