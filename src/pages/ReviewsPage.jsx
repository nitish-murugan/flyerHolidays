import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import api from '../api/axios';
import './ReviewsPage.css';

const IMG_BASE = 'http://localhost:5000';

const DEFAULT_REVIEWS = [
  { _id: 1, name: 'Priya Sharma', location: 'Chennai', rating: 5, review: 'An absolutely wonderful experience! The team at Flyer Holidays took care of every detail. Our Manali trip was beyond expectations.', package: 'Manali Adventure' },
  { _id: 2, name: 'Rahul Mehta', location: 'Bangalore', rating: 5, review: 'Best travel agency I have used. The Kerala backwaters tour was perfectly organized with great hotels and food.', package: 'Kerala Backwaters' },
  { _id: 3, name: 'Sunita Patel', location: 'Mumbai', rating: 4, review: 'Excellent service and very professional team. The Rajasthan heritage tour was a dream come true for our family.', package: 'Rajasthan Heritage' },
  { _id: 4, name: 'Arjun Kumar', location: 'Hyderabad', rating: 5, review: 'Flyer Holidays made our anniversary trip to Goa absolutely magical. Every surprise was perfectly planned!', package: 'Goa Beach Escape' },
  { _id: 5, name: 'Meena Rao', location: 'Coimbatore', rating: 5, review: 'The Ooty trip was so well-organized. Kids loved every moment and we got great value for money.', package: 'Ooty Family Tour' },
  { _id: 6, name: 'Karthik Nair', location: 'Kochi', rating: 4, review: 'Great Andaman package at an unbeatable price. The beach activities were thrilling and the resorts were top class.', package: 'Andaman Islands' },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    api.get('/reviews').then(r => setReviews(r.data)).catch(() => {});
  }, []);

  const displayReviews = (reviews.length > 0 ? reviews : DEFAULT_REVIEWS)
    .filter(r => filter === 0 || r.rating === filter);

  return (
    <div>
      <div className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag"><FiStar /> Testimonials</span>
          <h1 className="section-title">What Our <span>Travellers Say</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Real stories from real travellers who explored India with us
          </p>
        </div>
      </div>
      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="review-filter">
          {[0, 5, 4, 3].map(r => (
            <button key={r} className={`filter-btn ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)}>
              {r === 0 ? 'All Reviews' : `${r} ★`}
            </button>
          ))}
        </div>
        <div className="reviews-full-grid">
          {displayReviews.map(r => (
            <div className="review-card-full" key={r._id}>
              <div className="review-stars-row">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} style={{ color: i < r.rating ? '#FFD700' : 'var(--border)' }} />
                ))}
                <span className="review-pkg">{r.package}</span>
              </div>
              <p className="review-text-full">"{r.review}"</p>
              <div className="review-author-row">
                {r.avatar
                  ? <img src={r.avatar.startsWith('/uploads') ? IMG_BASE + r.avatar : r.avatar} alt={r.name} className="review-avatar" />
                  : <div className="review-avatar review-avatar-letter">{r.name[0]}</div>}
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
