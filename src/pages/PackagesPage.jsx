import { useState, useEffect } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { MdFlight } from 'react-icons/md';
import PackageCard from '../components/PackageCard';
import api from '../api/axios';
import './PackagesPage.css';

export default function PackagesPage() {
  const [states, setStates] = useState([]);
  const [activeState, setActiveState] = useState('all');
  const [packages, setPackages] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/states').then(r => setStates(r.data)).catch(() => {});
    // Load all packages by fetching featured first, then by state
    api.get('/packages/featured').then(r => {
      setAllPackages(r.data);
      setPackages(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleStateFilter = async (stateId) => {
    setActiveState(stateId);
    setLoading(true);
    if (stateId === 'all') {
      setPackages(allPackages);
      setLoading(false);
      return;
    }
    try {
      const r = await api.get(`/packages/by-state/${stateId}`);
      setPackages(r.data);
    } catch { setPackages([]); }
    setLoading(false);
  };

  return (
    <div className="packages-page">
      <div className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag"><MdFlight /> Our Packages</span>
          <h1 className="section-title">Explore All <span>Tour Packages</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Choose from our handcrafted itineraries across India's most stunning destinations
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="state-tabs" style={{ marginBottom: '40px' }}>
          <button
            className={`state-tab ${activeState === 'all' ? 'active' : ''}`}
            onClick={() => handleStateFilter('all')}
          >All Destinations</button>
          {states.map(s => (
            <button
              key={s._id}
              className={`state-tab ${activeState === s._id ? 'active' : ''}`}
              onClick={() => handleStateFilter(s._id)}
            >{s.name}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-wrap"><div className="spinner" /></div>
        ) : packages.length > 0 ? (
          <div className="packages-full-grid">
            {packages.map(pkg => <PackageCard key={pkg._id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="empty-state">
            <MdFlight />
            <p>No packages found for this destination. <a href="/contact">Enquire for custom packages!</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
