import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminLayout.css';

const IMG_BASE = 'https://flyer-holidays-backend.vercel.app';

export default function AdminSettings() {
  const [form, setForm] = useState({ siteName: 'Flyer Holidays', tagline: '', phone: '', email: '', address: '', whatsapp: '', facebook: '', instagram: '', youtube: '', formsphereId: '', aboutTitle: '', aboutDescription: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState('');
  const [currentAboutImg, setCurrentAboutImg] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    api.get('/site-settings').then(r => {
      const s = r.data;
      setForm({ siteName: s.siteName || '', tagline: s.tagline || '', phone: s.phone || '', email: s.email || '', address: s.address || '', whatsapp: s.whatsapp || '', facebook: s.facebook || '', instagram: s.instagram || '', youtube: s.youtube || '', formsphereId: s.formsphereId || '', aboutTitle: s.aboutTitle || '', aboutDescription: s.aboutDescription || '' });
      setCurrentLogo(s.logo || '');
      setCurrentAboutImg(s.aboutImage || '');
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setSaved(false);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (logoFile) fd.append('logo', logoFile);
    if (aboutImageFile) fd.append('aboutImage', aboutImageFile);
    try { await api.put('/site-settings', fd); setSaved(true); setTimeout(() => setSaved(false), 3000); } catch { alert('Error saving'); }
    setSaving(false);
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg('Passwords do not match'); return; }
    setPwSaving(true); setPwMsg('');
    try { await api.post('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }); setPwMsg('✓ Password changed successfully'); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); } catch (err) { setPwMsg(err.response?.data?.message || 'Error'); }
    setPwSaving(false);
  };

  const Field = ({ label, name, type = 'text', placeholder }) => (
    <div className="admin-form-group">
      <label>{label}</label>
      <input type={type} placeholder={placeholder} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} />
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Site <span>Settings</span></h1>
      </div>
      <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '17px' }}>General Info</h3>
          <div className="admin-form-row">
            <Field label="Site Name" name="siteName" />
            <Field label="Tagline" name="tagline" />
          </div>
          <div className="admin-form-row">
            <Field label="Phone" name="phone" />
            <Field label="WhatsApp (with country code)" name="whatsapp" placeholder="+919876543210" />
          </div>
          <Field label="Email" name="email" type="email" />
          <Field label="Address" name="address" />
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '17px' }}>Social Media</h3>
          <div className="admin-form-row">
            <Field label="Facebook URL" name="facebook" />
            <Field label="Instagram URL" name="instagram" />
          </div>
          <Field label="YouTube URL" name="youtube" />
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '17px' }}>About Page</h3>
          <Field label="About Page Title" name="aboutTitle" />
          <div className="admin-form-group">
            <label>About Description</label>
            <textarea rows={5} value={form.aboutDescription} onChange={e => setForm({ ...form, aboutDescription: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>About Page Image</label>
            {currentAboutImg && <img src={currentAboutImg.startsWith('/uploads') ? IMG_BASE + currentAboutImg : currentAboutImg} alt="About" style={{ width: '200px', borderRadius: '8px', marginBottom: '8px' }} />}
            <input type="file" accept="image/*" onChange={e => setAboutImageFile(e.target.files[0])} style={{ background: 'none', border: 'none', padding: '6px 0', color: 'var(--text-secondary)' }} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '17px' }}>Logo</h3>
          {currentLogo && <img src={currentLogo.startsWith('/uploads') ? IMG_BASE + currentLogo : currentLogo} alt="Logo" style={{ height: '60px', marginBottom: '16px' }} />}
          <div className="admin-form-group">
            <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} style={{ background: 'none', border: 'none', padding: '6px 0', color: 'var(--text-secondary)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button type="submit" className="admin-btn" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
          {saved && <span style={{ color: '#22c55e', fontSize: '14px' }}>✓ Settings saved!</span>}
        </div>
      </form>

      {/* Change Password */}
      <div style={{ maxWidth: '500px', marginTop: '40px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>
        <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '17px' }}>Change Admin Password</h3>
        <form className="admin-form" onSubmit={handlePwChange}>
          <div className="admin-form-group">
            <label>Current Password</label>
            <input type="password" required value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>New Password</label>
            <input type="password" required value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label>Confirm New Password</label>
            <input type="password" required value={pwForm.confirmPassword} onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
          </div>
          {pwMsg && <p style={{ color: pwMsg.startsWith('✓') ? '#22c55e' : '#ef4444', fontSize: '14px' }}>{pwMsg}</p>}
          <button type="submit" className="admin-btn" disabled={pwSaving}>{pwSaving ? 'Changing...' : 'Change Password'}</button>
        </form>
      </div>
    </div>
  );
}
