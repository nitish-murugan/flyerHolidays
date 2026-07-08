import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { FiStar } from 'react-icons/fi';
import api from '../../api/axios';
import './AdminLayout.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', location: '', rating: 5, review: '', package: '', isFeatured: false });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/reviews/admin/all').then(r => setReviews(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', location: '', rating: 5, review: '', package: '', isFeatured: false }); setAvatarFile(null); setModal(true); };
  const openEdit = (r) => { setEditing(r); setForm({ name: r.name, location: r.location, rating: r.rating, review: r.review, package: r.package, isFeatured: r.isFeatured }); setAvatarFile(null); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (avatarFile) fd.append('avatar', avatarFile);
    try {
      if (editing) await api.put(`/reviews/${editing._id}`, fd);
      else await api.post('/reviews', fd);
      await load(); setModal(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    await api.delete(`/reviews/${id}`); load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customer <span>Reviews</span></h1>
        <button className="admin-btn" onClick={openAdd}><FiPlus /> Add Review</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Avatar</th><th>Name</th><th>Location</th><th>Rating</th><th>Review</th><th>Package</th><th>Featured</th><th>Actions</th></tr></thead>
          <tbody>
            {reviews.map(r => (
              <tr key={r._id}>
                <td>{r.avatar ? <img src={r.avatar.startsWith('/uploads') ? IMG_BASE + r.avatar : r.avatar} alt={r.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>{r.name?.[0]}</div>}</td>
                <td style={{ color: '#fff', fontWeight: 600 }}>{r.name}</td>
                <td>{r.location}</td>
                <td>{[...Array(5)].map((_, i) => <FiStar key={i} style={{ color: i < r.rating ? '#FFD700' : 'var(--border)', fontSize: '12px' }} />)}</td>
                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.review}</td>
                <td>{r.package || '—'}</td>
                <td><span className={`status-badge ${r.isFeatured ? 'status-active' : 'status-inactive'}`}>{r.isFeatured ? 'Yes' : 'No'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-btn secondary" onClick={() => openEdit(r)}><FiEdit2 /></button>
                    <button className="admin-btn danger" onClick={() => handleDelete(r._id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{editing ? 'Edit Review' : 'Add Review'}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Customer Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Rating (1-5) *</label>
                  <input required type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Package Name</label>
                  <input value={form.package} onChange={e => setForm({ ...form, package: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Review Text *</label>
                <textarea required rows={4} value={form.review} onChange={e => setForm({ ...form, review: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label>Avatar Photo</label>
                <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} style={{ background: 'none', border: 'none', padding: '6px 0', color: 'var(--text-secondary)' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                Show as Featured Review
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Review'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
