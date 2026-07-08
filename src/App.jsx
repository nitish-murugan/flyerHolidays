import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import GalleryPage from './pages/GalleryPage';
import ServicesPage from './pages/ServicesPage';
import ReviewsPage from './pages/ReviewsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStates from './pages/admin/AdminStates';
import AdminPackages from './pages/admin/AdminPackages';
import AdminGallery from './pages/admin/AdminGallery';
import AdminReviews from './pages/admin/AdminReviews';
import AdminHero from './pages/admin/AdminHero';
import AdminServices from './pages/admin/AdminServices';
import AdminStats from './pages/admin/AdminStats';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
      <Route path="/packages" element={<><Navbar /><PackagesPage /><Footer /></>} />
      <Route path="/packages/:id" element={<><Navbar /><PackageDetailPage /><Footer /></>} />
      <Route path="/gallery" element={<><Navbar /><GalleryPage /><Footer /></>} />
      <Route path="/services" element={<><Navbar /><ServicesPage /><Footer /></>} />
      <Route path="/reviews" element={<><Navbar /><ReviewsPage /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
      <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />

      {/* Admin Routes (hidden from UI, manual /admin) */}
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="hero" element={<AdminHero />} />
        <Route path="states" element={<AdminStates />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
