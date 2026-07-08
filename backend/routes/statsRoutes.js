const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');
const { protect } = require('../middleware/authMiddleware');

// GET stats (public)
router.get('/', async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({});
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update stats (admin)
router.put('/', protect, async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create(req.body);
    } else {
      stats = await Stats.findByIdAndUpdate(stats._id, req.body, { new: true });
    }
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
