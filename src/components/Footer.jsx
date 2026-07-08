import { Link } from 'react-router-dom';
import { MdFlight } from 'react-icons/md';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <MdFlight className="footer-logo-icon" />
              <span>Flyer <span>Holidays</span></span>
            </Link>
            <p>Creating unforgettable journeys across India's most breathtaking destinations. Your dream vacation starts here.</p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" aria-label="YouTube"><FiYoutube /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {[['/', 'Home'], ['/packages', 'Tour Packages'], ['/gallery', 'Gallery'], ['/services', 'Services'], ['/reviews', 'Reviews'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([path, label]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li><FiPhone /><a href="tel:+919876543210">+91 98765 43210</a></li>
              <li><FiMail /><a href="mailto:info@flyerholidays.com">info@flyerholidays.com</a></li>
              <li><FiMapPin /><span>Chennai, Tamil Nadu, India</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Flyer Holidays. All rights reserved.</p>
          <p>Made with ❤️ for travellers</p>
        </div>
      </div>
    </footer>
  );
}
