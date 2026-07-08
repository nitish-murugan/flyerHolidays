import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Packages', path: '/packages' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Services', path: '/services' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        <Link to="/" className="nav-logo">
          <MdFlight className="logo-icon" />
          <span>Flyer <span className="logo-accent">Holidays</span></span>
        </Link>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(l => (
            <li key={l.path}>
              <Link
                to={l.path}
                className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="nav-cta-mobile">
            <a href="tel:+919876543210" className="btn-primary">
              <FiPhone /> Call Us
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <a href="tel:+919876543210" className="nav-phone">
            <FiPhone /> +91 98765 43210
          </a>
          <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}
