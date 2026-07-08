import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiStar, FiArrowLeft, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import api from '../api/axios';
import './PackageDetailPage.css';

const IMG_BASE = 'http://localhost:5000';

export default function PackageDetailPage() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', travelDate: '', travellers: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get(`/packages/${id}`).then(r => { setPkg(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/enquiries', { ...form, packageId: id, packageName: pkg?.title });
      setSubmitted(true);
    } catch { alert('Something went wrong. Please try again.'); }
    setSubmitting(false);
  };

  if (loading) return <div className="loading-wrap" style={{ minHeight: '80vh' }}><div className="spinner" /></div>;
  if (!pkg) return <div className="page-hero"><div className="container"><h2>Package not found</h2><Link to="/packages" className="btn-primary">← Back to Packages</Link></div></div>;

  const images = pkg.images?.length > 0
    ? pkg.images.map(i => i.startsWith('/uploads') ? IMG_BASE + i : i)
    : [`https://picsum.photos/seed/${id}/800/500`];

  return (
    <div className="detail-page">
      <div className="detail-gallery">
        <div className="detail-main-img">
          <img src={images[activeImg]} alt={pkg.title} />
          {images.length > 1 && (
            <>
              <button className="gallery-nav prev" onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}><FiChevronLeft /></button>
              <button className="gallery-nav next" onClick={() => setActiveImg(i => (i + 1) % images.length)}><FiChevronRight /></button>
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="detail-thumbs">
            {images.map((src, i) => (
              <img key={i} src={src} alt="" className={activeImg === i ? 'active' : ''} onClick={() => setActiveImg(i)} />
            ))}
          </div>
        )}
      </div>

      <div className="container">
        <Link to="/packages" className="back-link"><FiArrowLeft /> All Packages</Link>
        <div className="detail-layout">
          <div className="detail-main">
            <div className="detail-header">
              <div className="detail-location"><MdLocationOn /> {pkg.state?.name}</div>
              <h1 className="detail-title">{pkg.title}</h1>
              <div className="detail-meta">
                <span><FiClock /> {pkg.duration}</span>
                <span><FiStar /> {pkg.rating} Rating</span>
              </div>
              <div className="detail-price-inline">
                {pkg.originalPrice > pkg.price && <span className="old-price">₹{pkg.originalPrice.toLocaleString()}</span>}
                <span className="current-price">₹{pkg.price.toLocaleString()}</span>
                <span className="per-person">/ person</span>
              </div>
            </div>

            {pkg.highlights?.length > 0 && (
              <div className="detail-section">
                <h3>Package Highlights</h3>
                <ul className="highlights-list">
                  {pkg.highlights.map((h, i) => <li key={i}><FiCheck />{h}</li>)}
                </ul>
              </div>
            )}

            {pkg.description && (
              <div className="detail-section">
                <h3>About This Package</h3>
                <p>{pkg.description}</p>
              </div>
            )}

            {pkg.itinerary?.length > 0 && (
              <div className="detail-section">
                <h3>Day-by-Day Itinerary</h3>
                <div className="itinerary">
                  {pkg.itinerary.map((day, i) => (
                    <div className="itinerary-item" key={i}>
                      <div className="day-badge">Day {day.day}</div>
                      <div><strong>{day.title}</strong><p>{day.description}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="inclusions-grid">
              {pkg.inclusions?.length > 0 && (
                <div className="incl-card">
                  <h3>Inclusions</h3>
                  <ul>{pkg.inclusions.map((i, idx) => <li key={idx}><FiCheck className="incl-yes" />{i}</li>)}</ul>
                </div>
              )}
              {pkg.exclusions?.length > 0 && (
                <div className="incl-card">
                  <h3>Exclusions</h3>
                  <ul>{pkg.exclusions.map((e, idx) => <li key={idx}><FiX className="incl-no" />{e}</li>)}</ul>
                </div>
              )}
            </div>
          </div>

          {/* ENQUIRY FORM */}
          <aside className="enquiry-sidebar">
            <div className="enquiry-card">
              <h3>Send Enquiry</h3>
              <p>Fill the form and we'll contact you shortly!</p>
              {submitted ? (
                <div className="enquiry-success">
                  <FiCheck />
                  <h4>Enquiry Received!</h4>
                  <p>We'll call you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="enquiry-form">
                  <input required placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <input required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <input required placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <input type="date" value={form.travelDate} onChange={e => setForm({ ...form, travelDate: e.target.value })} />
                  <input type="number" min="1" placeholder="No. of Travellers" value={form.travellers} onChange={e => setForm({ ...form, travellers: e.target.value })} />
                  <textarea placeholder="Any special requirements?" rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                    {submitting ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
