import { useState, useEffect } from 'react';
import { MdFlight, MdHotel, MdDirectionsBus, MdExplore, MdCamera, MdSecurity } from 'react-icons/md';
import api from '../api/axios';
import './ServicesPage.css';

const iconMap = { MdFlight, MdHotel, MdDirectionsBus, MdExplore, MdCamera, MdSecurity };
const defaultIcons = [MdFlight, MdHotel, MdDirectionsBus, MdExplore, MdCamera, MdSecurity];

const DEFAULT_SERVICES = [
  { title: 'Flight Booking', description: 'Best airfare deals and hassle-free flight bookings for all domestic and international routes.' },
  { title: 'Hotel Accommodation', description: 'Carefully selected hotels from budget to luxury, ensuring comfort at every destination.' },
  { title: 'Transport', description: 'Comfortable AC cabs, coaches and private vehicles throughout your entire journey.' },
  { title: 'Tour Planning', description: 'Custom itineraries crafted by expert travel consultants for unforgettable experiences.' },
  { title: 'Photography Tours', description: 'Special photography-focused tours to capture India\'s most scenic landscapes.' },
  { title: 'Travel Insurance', description: 'Comprehensive travel insurance coverage for a completely worry-free journey.' },
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data)).catch(() => {});
  }, []);

  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;

  return (
    <div>
      <div className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">What We Offer</span>
          <h1 className="section-title">Our <span>Premium Services</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            End-to-end travel solutions crafted for your comfort and convenience
          </p>
        </div>
      </div>
      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="services-full-grid">
          {displayServices.map((s, i) => {
            const Icon = iconMap[s.icon] || defaultIcons[i % defaultIcons.length];
            return (
              <div className="service-card-full" key={s._id || i}>
                <div className="service-icon-wrap"><Icon /></div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
