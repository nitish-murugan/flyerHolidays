import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFlight } from 'react-icons/md';
import { FiLock, FiUser } from 'react-icons/fi';
import api from '../../api/axios';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('flyerAdminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <MdFlight />
          <span>Flyer <span>Admin</span></span>
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to manage your travel website</p>
        {error && <div className="admin-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <FiUser />
            <input required placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="admin-input-group">
            <FiLock />
            <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
