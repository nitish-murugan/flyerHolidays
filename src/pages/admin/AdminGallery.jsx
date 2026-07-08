import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import api from '../../api/axios';
import './AdminLayout.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ caption: '', location: '', customerName: '', order: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/gallery/admin/all').then(r => setPhotos(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ caption: '', location: '', customerName: '', order: 0 }); setImageFile(null); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ caption: p.caption, location: p.location, customerName: p.customerName, order: p.order }); setImageFile(null); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editing) await api.put(`/gallery/${editing._id}`, fd);
      else await api.post('/gallery', fd);
      await load(); setModal(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    await api.delete(`/gallery/${id}`); load();
  };

  const toggleActive = async (p) => {
    const fd = new FormData(); fd.append('isActive', !p.isActive);
    await api.put(`/gallery/${p._id}`, fd); load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gallery <span>Photos</span></h1>
        <button className="admin-btn" onClick={openAdd}><FiPlus /> Add Photo</button>
      </div>
      <div className="gallery-admin-grid">
        {photos.map(p => (
          <div className="gallery-admin-card" key={p._id}>
            <img src={p.image.startsWith('/uploads') ? IMG_BASE + p.image : p.image} alt={p.caption} />
            <div className="gallery-admin-info">
              <p>{p.caption || 'No caption'}</p>
              <small>{p.customerName} • {p.location}</small>
              <div className="gallery-admin-actions">
                <button className="admin-btn secondary" onClick={() => openEdit(p)}><FiEdit2 /></button>
                <button className="admin-btn" style={{ background: p.isActive ? '#22c55e22' : 'var(--glass)', color: p.isActive ? '#22c55e' : 'var(--text-muted)', border: '1px solid currentColor', fontSize: '12px', padding: '6px 12px' }} onClick={() => toggleActive(p)}>
                  {p.isActive ? 'Active' : 'Hidden'}
                </button>
                <button className="admin-btn danger" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{editing ? 'Edit Photo' : 'Add Gallery Photo'}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Photo {!editing && '*'}</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required={!editing} style={{ background: 'none', border: 'none', padding: '6px 0', color: 'var(--text-secondary)' }} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Customer Name</label>
                  <input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Caption</label>
                <input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Photo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .gallery-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .gallery-admin-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
        .gallery-admin-card img { width: 100%; height: 180px; object-fit: cover; }
        .gallery-admin-info { padding: 14px; }
        .gallery-admin-info p { color: #fff; font-size: 14px; margin-bottom: 4px; }
        .gallery-admin-info small { color: var(--text-muted); font-size: 12px; }
        .gallery-admin-actions { display: flex; gap: 8px; margin-top: 12px; }
      `}</style>
    </div>
  );
}
