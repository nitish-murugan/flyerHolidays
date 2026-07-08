import { useState, useEffect } from 'react';
import { FiInbox, FiPackage, FiMap, FiImage, FiStar } from 'react-icons/fi';
import { MdPeople } from 'react-icons/md';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import './AdminLayout.css';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ enquiries: 0, packages: 0, states: 0, gallery: 0, reviews: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/enquiries/admin/all'),
      api.get('/packages/admin/all'),
      api.get('/states/admin/all'),
      api.get('/gallery/admin/all'),
      api.get('/reviews/admin/all'),
    ]).then(([enq, pkgs, states, gal, revs]) => {
      setCounts({
        enquiries: enq.data.length,
        packages: pkgs.data.length,
        states: states.data.length,
        gallery: gal.data.length,
        reviews: revs.data.length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Enquiries', value: counts.enquiries, icon: <FiInbox />, path: '/admin/enquiries', color: '#3b82f6' },
    { label: 'Packages', value: counts.packages, icon: <FiPackage />, path: '/admin/packages', color: 'var(--primary)' },
    { label: 'States', value: counts.states, icon: <FiMap />, path: '/admin/states', color: '#8b5cf6' },
    { label: 'Gallery Photos', value: counts.gallery, icon: <FiImage />, path: '/admin/gallery', color: '#22c55e' },
    { label: 'Reviews', value: counts.reviews, icon: <FiStar />, path: '/admin/reviews', color: '#eab308' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard <span>Overview</span></h1>
      </div>
      <div className="dashboard-grid">
        {cards.map(c => (
          <Link to={c.path} key={c.label} className="dashboard-card" style={{ '--card-color': c.color }}>
            <div className="dashboard-icon">{c.icon}</div>
            <div className="dashboard-info">
              <span className="dashboard-value">{c.value}</span>
              <span className="dashboard-label">{c.label}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="dashboard-quick">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          {[
            { to: '/admin/packages', label: '+ Add Package' },
            { to: '/admin/hero', label: '+ Add Banner' },
            { to: '/admin/gallery', label: '+ Add Photo' },
            { to: '/admin/reviews', label: '+ Add Review' },
            { to: '/admin/states', label: '+ Add State' },
            { to: '/admin/enquiries', label: 'View Enquiries' },
          ].map(a => (
            <Link key={a.to} to={a.to} className="quick-action-btn">{a.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
