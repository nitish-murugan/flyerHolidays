import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminLayout.css';

export default function AdminStats() {
  const [form, setForm] = useState({ happyTravellers: 5000, toursCompleted: 500, destinations: 50, yearsExperience: 10 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { api.get('/stats').then(r => setForm({ happyTravellers: r.data.happyTravellers, toursCompleted: r.data.toursCompleted, destinations: r.data.destinations, yearsExperience: r.data.yearsExperience })).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setSaved(false);
    try { await api.put('/stats', form); setSaved(true); setTimeout(() => setSaved(false), 3000); } catch (err) { alert('Error saving'); }
    setSaving(false);
  };

  const fields = [
    { key: 'happyTravellers', label: 'Happy Travellers' },
    { key: 'toursCompleted', label: 'Tours Completed' },
    { key: 'destinations', label: 'Destinations' },
    { key: 'yearsExperience', label: 'Years of Experience' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Homepage <span>Stats</span></h1>
      </div>
      <div style={{ maxWidth: '600px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
            These numbers appear in the homepage promotion section as animated counters.
          </p>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-row">
              {fields.map(f => (
                <div className="admin-form-group" key={f.key}>
                  <label>{f.label}</label>
                  <input type="number" min="0" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: Number(e.target.value) })} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Stats'}</button>
              {saved && <span style={{ color: '#22c55e', fontSize: '14px' }}>✓ Saved successfully!</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
