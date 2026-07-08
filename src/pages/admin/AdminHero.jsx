import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import api from '../../api/axios';
import './AdminLayout.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

export default function AdminHero() {
  const [banners, setBanners] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', order: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/hero/admin/all').then(r => setBanners(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', subtitle: '', order: 0 }); setImageFile(null); setModal(true); };
  const openEdit = (b) => { setEditing(b); setForm({ title: b.title, subtitle: b.subtitle, order: b.order }); setImageFile(null); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editing) await api.put(`/hero/${editing._id}`, fd);
      else await api.post('/hero', fd);
      await load(); setModal(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    await api.delete(`/hero/${id}`); load();
  };

  const toggleActive = async (b) => {
    const fd = new FormData(); fd.append('isActive', !b.isActive);
    await api.put(`/hero/${b._id}`, fd); load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Hero <span>Banners</span></h1>
        <button className="admin-btn" onClick={openAdd}><FiPlus /> Add Banner</button>
      </div>
      <div className="gallery-admin-grid">
        {banners.map(b => (
          <div className="gallery-admin-card" key={b._id}>
            <img src={b.image.startsWith('/uploads') ? IMG_BASE + b.image : b.image} alt={b.title} />
            <div className="gallery-admin-info">
              <p>{b.title || 'No title'}</p>
              <small>{b.subtitle || 'No subtitle'} | Order: {b.order}</small>
              <div className="gallery-admin-actions">
                <button className="admin-btn secondary" onClick={() => openEdit(b)}><FiEdit2 /></button>
                <button className="admin-btn" style={{ background: b.isActive ? '#22c55e22' : 'var(--glass)', color: b.isActive ? '#22c55e' : 'var(--text-muted)', border: '1px solid currentColor', fontSize: '12px', padding: '6px 12px' }} onClick={() => toggleActive(b)}>
                  {b.isActive ? 'Active' : 'Hidden'}
                </button>
                <button className="admin-btn danger" onClick={() => handleDelete(b._id)}><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{editing ? 'Edit Banner' : 'Add Hero Banner'}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Banner Image {!editing && '*'}</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required={!editing} style={{ background: 'none', border: 'none', padding: '6px 0', color: 'var(--text-secondary)' }} />
              </div>
              <div className="admin-form-group">
                <label>Title Text</label>
                <input placeholder="Discover India's Hidden Wonders" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label>Subtitle</label>
                <input placeholder="From misty mountains to golden beaches..." value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label>Order (lower = shown first)</label>
                <input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Banner'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .gallery-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .gallery-admin-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
        .gallery-admin-card img { width: 100%; height: 180px; object-fit: cover; }
        .gallery-admin-info { padding: 14px; }
        .gallery-admin-info p { color: #fff; font-size: 14px; margin-bottom: 4px; font-weight: 600; }
        .gallery-admin-info small { color: var(--text-muted); font-size: 12px; }
        .gallery-admin-actions { display: flex; gap: 8px; margin-top: 12px; }
      `}</style>
    </div>
  );
}
