import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import api from '../api/axios';
import './GalleryPage.css';

const IMG_BASE = 'http://localhost:5000';
const FALLBACKS = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
  'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80',
  'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&q=80',
  'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80',
  'https://images.unsplash.com/photo-1522878129833-838a904a0e9e?w=600&q=80',
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/gallery').then(r => { setPhotos(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const items = photos.length > 0
    ? photos.map(p => ({ src: p.image.startsWith('/uploads') ? IMG_BASE + p.image : p.image, caption: p.caption, customer: p.customerName, location: p.location }))
    : FALLBACKS.map((src, i) => ({ src, caption: 'Travel Memory', customer: `Happy Traveller ${i + 1}`, location: 'India' }));

  return (
    <div className="gallery-page">
      <div className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag"><FaHeart /> Travel Stories</span>
          <h1 className="section-title">Moments from <span>Beautiful Journeys</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Real photographs from our travellers' most memorable adventures
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : (
          <div className="gallery-grid">
            {items.map((item, i) => (
              <div className="gallery-item-full" key={i} onClick={() => setLightbox(item)}>
                <img src={item.src} alt={item.caption} loading="lazy" />
                <div className="gallery-hover">
                  <p className="gallery-caption">{item.caption}</p>
                  <span className="gallery-customer">— {item.customer}, {item.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} />
            <div className="lightbox-info">
              <p>{lightbox.caption}</p>
              <span>— {lightbox.customer}, {lightbox.location}</span>
            </div>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
