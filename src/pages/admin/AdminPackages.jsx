import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import './AdminLayout.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [states, setStates] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', state: '', duration: '', price: '', originalPrice: '', description: '', rating: 4.5, isFeatured: false });
  const [highlights, setHighlights] = useState('');
  const [inclusions, setInclusions] = useState('');
  const [exclusions, setExclusions] = useState('');
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [pkgs, sts] = await Promise.all([api.get('/packages/admin/all'), api.get('/states/admin/all')]);
    setPackages(pkgs.data); setStates(sts.data);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', state: states[0]?._id || '', duration: '', price: '', originalPrice: '', description: '', rating: 4.5, isFeatured: false });
    setHighlights(''); setInclusions(''); setExclusions(''); setImages([]);
    setModal(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ title: p.title, state: p.state?._id || '', duration: p.duration, price: p.price, originalPrice: p.originalPrice, description: p.description, rating: p.rating, isFeatured: p.isFeatured });
    setHighlights(p.highlights?.join('\n') || '');
    setInclusions(p.inclusions?.join('\n') || '');
    setExclusions(p.exclusions?.join('\n') || '');
    setImages([]);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('highlights', JSON.stringify(highlights.split('\n').filter(Boolean)));
    fd.append('inclusions', JSON.stringify(inclusions.split('\n').filter(Boolean)));
    fd.append('exclusions', JSON.stringify(exclusions.split('\n').filter(Boolean)));
    if (editing) fd.append('existingImages', JSON.stringify(editing.images || []));
    Array.from(images).forEach(img => fd.append('images', img));
    try {
      if (editing) await api.put(`/packages/${editing._id}`, fd);
      else await api.post('/packages', fd);
      await load(); setModal(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return;
    await api.delete(`/packages/${id}`); load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tour <span>Packages</span></h1>
        <button className="admin-btn" onClick={openAdd}><FiPlus /> Add Package</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Title</th><th>State</th><th>Duration</th><th>Price</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {packages.map(p => (
              <tr key={p._id}>
                <td>{p.images?.[0] ? <img src={p.images[0].startsWith('/uploads') ? IMG_BASE + p.images[0] : p.images[0]} alt={p.title} /> : '—'}</td>
                <td style={{ color: '#fff', fontWeight: 600, maxWidth: '200px' }}>{p.title}</td>
                <td>{p.state?.name}</td>
                <td>{p.duration}</td>
                <td style={{ color: 'var(--primary)' }}>₹{p.price?.toLocaleString()}</td>
                <td><span className={`status-badge ${p.isFeatured ? 'status-active' : 'status-inactive'}`}>{p.isFeatured ? 'Yes' : 'No'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-btn secondary" onClick={() => openEdit(p)}><FiEdit2 /></button>
                    <button className="admin-btn danger" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '700px' }}>
            <h3>{editing ? 'Edit Package' : 'Add New Package'}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Package Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>State *</label>
                  <select required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Duration (e.g. 5D/4N) *</label>
                  <input required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price (₹) *</label>
                  <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label>Highlights (one per line)</label>
                <textarea rows={4} placeholder="Sunrise at Taj Mahal&#10;Camel Safari in Desert&#10;Boat Ride in Backwaters" value={highlights} onChange={e => setHighlights(e.target.value)} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Inclusions (one per line)</label>
                  <textarea rows={4} value={inclusions} onChange={e => setInclusions(e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Exclusions (one per line)</label>
                  <textarea rows={4} value={exclusions} onChange={e => setExclusions(e.target.value)} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Rating</label>
                  <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div className="admin-form-group" style={{ justifyContent: 'center', alignItems: 'flex-start', paddingTop: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                    Featured Package
                  </label>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Package Images</label>
                <input type="file" accept="image/*" multiple onChange={e => setImages(e.target.files)} style={{ background: 'none', border: 'none', padding: '6px 0', color: 'var(--text-secondary)' }} />
                {editing?.images?.length > 0 && <small style={{ color: 'var(--text-muted)' }}>{editing.images.length} existing image(s). New uploads will be added to them.</small>}
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Package'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
