const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const stateRoutes = require('./routes/stateRoutes');
const packageRoutes = require('./routes/packageRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const heroRoutes = require('./routes/heroRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const statsRoutes = require('./routes/statsRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/site-settings', siteSettingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Flyer Holidays API is running!' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flyerholidays';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    // Seed admin on first run
    const Admin = require('./models/Admin');
    const bcrypt = require('bcryptjs');
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin@flyer2024', 10);
      await Admin.create({ username: process.env.ADMIN_USERNAME || 'admin', password: hashed });
      console.log('✅ Admin user created');
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
