const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/authMiddleware');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, packageId, packageName, message, travelDate, travellers } = req.body;
    const enquiry = await Enquiry.create({ name, email, phone, packageId, packageName, message, travelDate, travellers });
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/admin/all', protect, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().populate('packageId', 'title').sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
