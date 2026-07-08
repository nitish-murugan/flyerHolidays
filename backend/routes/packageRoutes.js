const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET packages by state (public)
router.get('/by-state/:stateId', async (req, res) => {
  try {
    const packages = await Package.find({ state: req.params.stateId, isActive: true })
      .populate('state', 'name slug');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET featured packages (public)
router.get('/featured', async (req, res) => {
  try {
    const packages = await Package.find({ isFeatured: true, isActive: true })
      .populate('state', 'name slug').limit(6);
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single package (public)
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('state', 'name slug');
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all packages (admin)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const packages = await Package.find().populate('state', 'name slug').sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create package (admin)
router.post('/', protect, (req, res, next) => {
  req.uploadFolder = 'packages';
  next();
}, upload.array('images', 10), async (req, res) => {
  try {
    const { title, state, duration, price, originalPrice, highlights, description, inclusions, exclusions, itinerary, isFeatured, rating } = req.body;
    const images = req.files ? req.files.map(f => `/uploads/packages/${f.filename}`) : [];
    const pkg = await Package.create({
      title, state, duration, price, originalPrice,
      images,
      highlights: highlights ? JSON.parse(highlights) : [],
      description,
      inclusions: inclusions ? JSON.parse(inclusions) : [],
      exclusions: exclusions ? JSON.parse(exclusions) : [],
      itinerary: itinerary ? JSON.parse(itinerary) : [],
      isFeatured: isFeatured === 'true',
      rating: rating || 4.5,
    });
    const populated = await pkg.populate('state', 'name slug');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update package (admin)
router.put('/:id', protect, (req, res, next) => {
  req.uploadFolder = 'packages';
  next();
}, upload.array('images', 10), async (req, res) => {
  try {
    const { title, state, duration, price, originalPrice, highlights, description, inclusions, exclusions, itinerary, isFeatured, isActive, rating, existingImages } = req.body;
    const newImages = req.files ? req.files.map(f => `/uploads/packages/${f.filename}`) : [];
    const existing = existingImages ? JSON.parse(existingImages) : [];
    const updateData = {
      title, state, duration, price, originalPrice,
      images: [...existing, ...newImages],
      highlights: highlights ? JSON.parse(highlights) : [],
      description,
      inclusions: inclusions ? JSON.parse(inclusions) : [],
      exclusions: exclusions ? JSON.parse(exclusions) : [],
      itinerary: itinerary ? JSON.parse(itinerary) : [],
      isFeatured: isFeatured === 'true',
      isActive: isActive !== 'false',
      rating: rating || 4.5,
    };
    const pkg = await Package.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('state', 'name slug');
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE package (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
