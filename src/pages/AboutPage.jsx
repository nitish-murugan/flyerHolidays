import { useState, useEffect } from 'react';
import { FaAward, FaHeart, FaUsers } from 'react-icons/fa';
import { MdExplore } from 'react-icons/md';
import api from '../api/axios';
import './AboutPage.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

export default function AboutPage() {
  const [settings, setSettings] = useState(null);
  useEffect(() => { api.get('/site-settings').then(r => setSettings(r.data)).catch(() => {}); }, []);

  const aboutImg = settings?.aboutImage
    ? (settings.aboutImage.startsWith('/uploads') ? IMG_BASE + settings.aboutImage : settings.aboutImage)
    : 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80';

  return (
    <div>
      <div className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">Who We Are</span>
          <h1 className="section-title">About <span>Flyer Holidays</span></h1>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 24px' }}>
        <div className="about-grid">
          <div className="about-img-wrap">
            <img src={aboutImg} alt="About Flyer Holidays" />
            <div className="about-badge">
              <FaAward /> <div><span>10+</span><small>Years of Excellence</small></div>
            </div>
          </div>
          <div className="about-text">
            <span className="section-tag">Our Story</span>
            <h2 className="section-title">Creating <span>Unforgettable</span> Memories</h2>
            <p>{settings?.aboutDescription || 'Flyer Holidays was born from a passion for travel and a desire to share India\'s incredible beauty with the world. For over a decade, we\'ve been crafting personalised tour experiences that go beyond ordinary tourism — creating journeys that touch the heart and soul of every traveller.'}</p>
            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>From the snow-capped peaks of Himachal Pradesh to the sun-kissed beaches of Goa, from the royal heritage of Rajasthan to the serene backwaters of Kerala — we take you everywhere, ensuring every moment is memorable.</p>
            <div className="about-values">
              {[
                { icon: <FaHeart />, label: 'Passion for Travel' },
                { icon: <FaUsers />, label: 'Customer First' },
                { icon: <MdExplore />, label: 'Expert Planning' },
              ].map((v, i) => (
                <div className="about-value" key={i}>
                  <span>{v.icon}</span>
                  <p>{v.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
