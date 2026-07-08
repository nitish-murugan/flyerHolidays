import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdExplore, MdFlight, MdHotel, MdDirectionsBus } from 'react-icons/md';
import { FaUsers, FaMapMarkedAlt, FaAward, FaHeart } from 'react-icons/fa';
import PackageCard from '../components/PackageCard';
import api from '../api/axios';
import './HomePage.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

const HERO_FALLBACKS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&q=80',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1400&q=80',
];

const GALLERY_FALLBACKS = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80',
  'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&q=80',
];

function CountUp({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 2000;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [heroes, setHeroes] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);
  const [stats, setStats] = useState({ happyTravellers: 5000, toursCompleted: 500, destinations: 50, yearsExperience: 10 });
  const [states, setStates] = useState([]);
  const [activeState, setActiveState] = useState(null);
  const [packages, setPackages] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingPkgs, setLoadingPkgs] = useState(false);

  useEffect(() => {
    api.get('/hero').then(r => setHeroes(r.data)).catch(() => { });
    api.get('/stats').then(r => setStats(r.data)).catch(() => { });
    api.get('/states').then(r => { setStates(r.data); if (r.data[0]) setActiveState(r.data[0]._id); }).catch(() => { });
    api.get('/gallery').then(r => setGallery(r.data)).catch(() => { });
    api.get('/reviews').then(r => setReviews(r.data.slice(0, 6))).catch(() => { });
    api.get('/services').then(r => setServices(r.data.slice(0, 4))).catch(() => { });
  }, []);

  useEffect(() => {
    if (!activeState) return;
    setLoadingPkgs(true);
    api.get(`/packages/by-state/${activeState}`)
      .then(r => setPackages(r.data))
      .catch(() => { })
      .finally(() => setLoadingPkgs(false));
  }, [activeState]);

  useEffect(() => {
    if (heroes.length < 2) return;
    const t = setInterval(() => setCurrentHero(c => (c + 1) % heroes.length), 5000);
    return () => clearInterval(t);
  }, [heroes]);

  const heroImages = heroes.length > 0
    ? heroes.map(h => h.image.startsWith('/uploads') ? IMG_BASE + h.image : h.image)
    : HERO_FALLBACKS;

  const galleryImages = gallery.length > 0
    ? gallery.map(g => ({ src: g.image.startsWith('/uploads') ? IMG_BASE + g.image : g.image, caption: g.caption, customer: g.customerName, location: g.location }))
    : GALLERY_FALLBACKS.map(src => ({ src, caption: 'Travel Memory', customer: 'Happy Traveller', location: 'India' }));

  const serviceIcons = [MdFlight, MdHotel, MdDirectionsBus, MdExplore];

  return (
    <div className="home">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        {heroImages.map((src, i) => (
          <div key={i} className={`hero-slide ${i === currentHero ? 'active' : ''}`}>
            <img src={src} alt="Hero" />
            <div className="hero-overlay" />
          </div>
        ))}
        <div className="hero-content container">
          <div className="hero-tag"><MdExplore /> Premium Tour Packages</div>
          <h1 className="hero-title">
            Discover India's<br />
            <span>Hidden Wonders</span>
          </h1>
          <p className="hero-subtitle">
            From misty mountains to golden beaches — let Flyer Holidays craft your perfect escape.
          </p>
          <div className="hero-actions">
            <Link to="/packages" className="btn-primary">Explore Packages <FiArrowRight /></Link>
            <Link to="/contact" className="btn-outline">Get Free Quote</Link>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { icon: <FaUsers />, value: stats.happyTravellers, suffix: '+', label: 'Happy Travellers' },
              { icon: <FaMapMarkedAlt />, value: stats.toursCompleted, suffix: '+', label: 'Tours Completed' },
              { icon: <MdExplore />, value: stats.destinations, suffix: '+', label: 'Destinations' },
              { icon: <FaAward />, value: stats.yearsExperience, suffix: '+', label: 'Years Experience' },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-number">
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PACKAGES SECTION ===== */}
      <section className="packages-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-tag"><MdFlight /> Tour Packages</span>
              <h2 className="section-title">Explore Our <span>Best Packages</span></h2>
              <p className="section-subtitle">Handcrafted itineraries for every budget and travel style</p>
            </div>
            <Link to="/packages" className="btn-outline">View All <FiArrowRight /></Link>
          </div>

          {states.length > 0 && (
            <div className="state-tabs">
              {states.map(s => (
                <button
                  key={s._id}
                  className={`state-tab ${activeState === s._id ? 'active' : ''}`}
                  onClick={() => setActiveState(s._id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {loadingPkgs ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : packages.length > 0 ? (
            <div className="packages-grid">
              {packages.slice(0, 3).map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
            </div>
          ) : (
            <div className="empty-state">
              <MdExplore />
              <p>No packages available for this destination yet.</p>
              <Link to="/contact" className="btn-primary">Enquire Now</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      {services.length > 0 && (
        <section className="services-section">
          <div className="container">
            <div className="section-center">
              <span className="section-tag">What We Offer</span>
              <h2 className="section-title">Our <span>Premium Services</span></h2>
            </div>
            <div className="services-grid">
              {services.map((s, i) => {
                const Icon = serviceIcons[i % serviceIcons.length];
                return (
                  <div className="service-card" key={s._id}>
                    <div className="service-icon"><Icon /></div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== GALLERY SECTION ===== */}
      <section className="gallery-section">
        <div className="container">
          <div className="section-center">
            <span className="section-tag"><FaHeart /> Travel Stories</span>
            <h2 className="section-title">Moments from <span>Beautiful Journeys</span></h2>
            <p className="section-subtitle">Real memories captured by our wonderful travellers across India</p>
          </div>
          <div className="gallery-masonry">
            {galleryImages.slice(0, 6).map((item, i) => (
              <div className="gallery-item" key={i}>
                <img src={item.src} alt={item.caption} loading="lazy" />
                <div className="gallery-hover">
                  <p className="gallery-caption">{item.caption}</p>
                  <span className="gallery-customer">— {item.customer}, {item.location}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="section-center" style={{ marginTop: '40px' }}>
            <Link to="/gallery" className="btn-outline">View Full Gallery <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS SECTION ===== */}
      {reviews.length > 0 && (
        <section className="reviews-section">
          <div className="container">
            <div className="section-center">
              <span className="section-tag"><FiStar /> Testimonials</span>
              <h2 className="section-title">What Our <span>Travellers Say</span></h2>
            </div>
            <div className="reviews-grid">
              {reviews.map(r => (
                <div className="review-card" key={r._id}>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < r.rating ? 'star-filled' : 'star-empty'} />
                    ))}
                  </div>
                  <p className="review-text">"{r.review}"</p>
                  <div className="review-author">
                    {r.avatar
                      ? <img src={r.avatar.startsWith('/uploads') ? IMG_BASE + r.avatar : r.avatar} alt={r.name} />
                      : <div className="review-avatar-placeholder">{r.name[0]}</div>}
                    <div>
                      <strong>{r.name}</strong>
                      <span>{r.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow" />
            <h2>Ready for Your Next Adventure?</h2>
            <p>Let our travel experts craft the perfect journey for you. Get a free personalised quote today!</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn-primary">Plan My Trip <FiArrowRight /></Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="btn-outline">
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
