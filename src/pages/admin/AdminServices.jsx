import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import api from '../../api/axios';
import './AdminLayout.css';

const ICON_OPTIONS = ['MdFlight', 'MdHotel', 'MdDirectionsBus', 'MdExplore', 'MdCamera', 'MdSecurity', 'MdBeachAccess', 'MdMountain'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'MdFlight', order: 0 });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/services/admin/all').then(r => setServices(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ title: '', description: '', icon: 'MdFlight', order: 0 }); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ title: s.title, description: s.description, icon: s.icon, order: s.order }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await api.put(`/services/${editing._id}`, form);
      else await api.post('/services', form);
      await load(); setModal(false);
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    await api.delete(`/services/${id}`); load();
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Our <span>Services</span></h1>
        <button className="admin-btn" onClick={openAdd}><FiPlus /> Add Service</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Icon</th><th>Title</th><th>Description</th><th>Order</th><th>Actions</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s._id}>
                <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{s.icon}</td>
                <td style={{ color: '#fff', fontWeight: 600 }}>{s.title}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description}</td>
                <td>{s.order}</td>
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
            <h3>{editing ? 'Edit Service' : 'Add Service'}</h3>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>Service Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Icon</label>
                  <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}>
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Display Order</label>
                  <input type="number" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description *</label>
                <textarea required rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
