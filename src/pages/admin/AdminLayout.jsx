import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { MdFlight, MdDashboard, MdImage, MdPhotoLibrary, MdSettings, MdLogout, MdStar, MdMiscellaneousServices } from 'react-icons/md';
import { FiMap, FiPackage, FiInbox, FiBarChart2 } from 'react-icons/fi';
import './AdminLayout.css';

const MENU = [
  { path: 'dashboard', label: 'Dashboard', icon: <MdDashboard /> },
  { path: 'hero', label: 'Hero Banners', icon: <MdImage /> },
  { path: 'states', label: 'States', icon: <FiMap /> },
  { path: 'packages', label: 'Packages', icon: <FiPackage /> },
  { path: 'gallery', label: 'Gallery', icon: <MdPhotoLibrary /> },
  { path: 'reviews', label: 'Reviews', icon: <MdStar /> },
  { path: 'services', label: 'Services', icon: <MdMiscellaneousServices /> },
  { path: 'stats', label: 'Stats', icon: <FiBarChart2 /> },
  { path: 'enquiries', label: 'Enquiries', icon: <FiInbox /> },
  { path: 'settings', label: 'Site Settings', icon: <MdSettings /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('flyerAdminToken');
    if (!token) navigate('/admin');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('flyerAdminToken');
    navigate('/admin');
  };

  const isActive = (path) => location.pathname.includes(`/admin/${path}`);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <MdFlight />
          <span>Flyer <span>Admin</span></span>
        </div>
        <nav className="admin-nav">
          {MENU.map(item => (
            <Link
              key={item.path}
              to={`/admin/${item.path}`}
              className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          <MdLogout /> Logout
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
