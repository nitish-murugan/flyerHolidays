import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import './AdminLayout.css';
import './AdminDashboard.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

export default function AdminStates() {
  const [states, setStates] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', order: 0 });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/states/admin/all').then(r => setStates(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', slug: '', description: '', order: 0 }); setImageFile(null); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, slug: s.slug, description: s.description, order: s.order }); setImageFile(null); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    try {
      if (editing) await api.put(`/states/${editing._id}`, fd);
      else await api.post('/states', fd);
      await load(); closeModal();
    } catch (err) { alert(err.response?.data?.message || 'Error saving'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this state?')) return;
    await api.delete(`/states/${id}`); load();
  };

  const toggleActive = async (s) => {
    const fd = new FormData(); fd.append('isActive', !s.isActive);
    await api.put(`/states/${s._id}`, fd); load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">States <span>/ Destinations</span></h1>
        <button className="admin-btn" onClick={openAdd}><FiPlus /> Add State</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Image</th><th>Name</th><th>Slug</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {states.map(s => (
              <tr key={s._id}>
                <td>{s.image ? <img src={s.image.startsWith('/uploads') ? IMG_BASE + s.image : s.image} alt={s.name} /> : '—'}</td>
                <td style={{ color: '#fff', fontWeight: 600 }}>{s.name}</td>
                <td>{s.slug}</td>
                <td>{s.order}</td>
                <td>
                  <button className="admin-toggle" style={{ border: 'none' }} onClick={() => toggleActive(s)}>
                    <div className={`admin-toggle ${s.isActive ? 'on' : 'off'}`} />
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-btn secondary" onClick={() => openEdit(s)}><FiEdit2 /></button>
                    <button className="admin-btn danger" onClick={() => handleDelete(s._id)}><FiTrash2 /></button>
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
            <h3>{editing ? 'Edit State' : 'Add New State'}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>State Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
                </div>
                <div className="admin-form-group">
                  <label>Slug *</label>
                  <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ background: 'none', border: 'none', padding: '6px 0', color: 'var(--text-secondary)' }} />
                </div>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : 'Save State'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
