import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import './AdminLayout.css';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [filter, setFilter] = useState('all');

  const load = () => api.get('/enquiries/admin/all').then(r => setEnquiries(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/enquiries/${id}/status`, { status }); load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this enquiry?')) return;
    await api.delete(`/enquiries/${id}`); load();
  };

  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Customer <span>Enquiries</span></h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'new', 'contacted', 'closed'].map(s => (
            <button key={s} className={`admin-btn ${filter === s ? '' : 'secondary'}`} onClick={() => setFilter(s)} style={{ padding: '8px 16px', fontSize: '13px' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Email</th><th>Package</th><th>Travellers</th><th>Travel Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e._id}>
                <td style={{ whiteSpace: 'nowrap' }}>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
                <td style={{ color: '#fff', fontWeight: 600 }}>{e.name}</td>
                <td><a href={`tel:${e.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{e.phone}</a></td>
                <td style={{ fontSize: '13px' }}>{e.email}</td>
                <td>{e.packageName || '—'}</td>
                <td>{e.travellers}</td>
                <td>{e.travelDate || '—'}</td>
                <td>
                  <select
                    value={e.status}
                    onChange={ev => updateStatus(e._id, ev.target.value)}
                    className={`status-badge status-${e.status}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700 }}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td>
                  <button className="admin-btn danger" onClick={() => handleDelete(e._id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No enquiries found.</p>}
      </div>
    </div>
  );
}
