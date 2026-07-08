import { Link } from 'react-router-dom';
import { FiClock, FiStar, FiArrowRight } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import './PackageCard.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

export default function PackageCard({ pkg }) {
  const img = pkg.images?.[0]
    ? (pkg.images[0].startsWith('/uploads') ? IMG_BASE + pkg.images[0] : pkg.images[0])
    : `https://picsum.photos/seed/${pkg._id}/400/280`;

  const discount = pkg.originalPrice > pkg.price
    ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
    : 0;

  return (
    <div className="pkg-card">
      <div className="pkg-card-img">
        <img src={img} alt={pkg.title} loading="lazy" />
        {discount > 0 && <span className="pkg-badge">{discount}% OFF</span>}
        <div className="pkg-overlay" />
        <div className="pkg-state-tag">
          <MdLocationOn /> {pkg.state?.name || 'India'}
        </div>
      </div>
      <div className="pkg-card-body">
        <h3 className="pkg-title">{pkg.title}</h3>
        <div className="pkg-meta">
          <span className="pkg-duration"><FiClock /> {pkg.duration}</span>
          <span className="pkg-rating"><FiStar /> {pkg.rating}</span>
        </div>
        {pkg.highlights?.length > 0 && (
          <ul className="pkg-highlights">
            {pkg.highlights.slice(0, 3).map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        )}
        <div className="pkg-footer">
          <div className="pkg-price">
            {pkg.originalPrice > pkg.price && (
              <span className="pkg-price-original">₹{pkg.originalPrice.toLocaleString()}</span>
            )}
            <span className="pkg-price-current">₹{pkg.price.toLocaleString()}</span>
            <span className="pkg-price-per">/ person</span>
          </div>
          <Link to={`/packages/${pkg._id}`} className="pkg-btn">
            View <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
