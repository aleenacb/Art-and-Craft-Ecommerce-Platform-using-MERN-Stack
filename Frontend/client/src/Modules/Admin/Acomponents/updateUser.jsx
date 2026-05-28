import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .uu-root {
    min-height: 100vh;
    background: #fdf6f0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 20px;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* blobs */
  .uu-blob {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(90px);
    opacity: 0.35;
    z-index: 0;
  }
  .uu-blob-1 { width: 520px; height: 520px; top: -180px; right: -180px; background: #f5c9b3; }
  .uu-blob-2 { width: 420px; height: 420px; bottom: -140px; left: -140px; background: #e8d5c4; }
  .uu-blob-3 { width: 280px; height: 280px; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #fde8d8; }

  /* card */
  .uu-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 540px;
    background: #fff;
    border-radius: 28px;
    overflow: hidden;
    box-shadow:
      0 2px 0 rgba(212,113,78,0.14),
      0 24px 64px rgba(180,100,60,0.12),
      0 4px 20px rgba(0,0,0,0.05);
    animation: uu-rise 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes uu-rise {
    from { opacity: 0; transform: translateY(32px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* accent top bar */
  .uu-bar {
    height: 5px;
    background: linear-gradient(90deg, #D4714E, #e8956e, #EF9F27, #D4714E);
    background-size: 300% 100%;
    animation: uu-bar-shift 4s ease infinite;
  }
  @keyframes uu-bar-shift {
    0%   { background-position: 0% 0; }
    50%  { background-position: 100% 0; }
    100% { background-position: 0% 0; }
  }

  /* header */
  .uu-header {
    padding: 36px 40px 28px;
    border-bottom: 1px solid #f3ebe5;
  }

  .uu-eyebrow {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #D4714E;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .uu-eyebrow::before {
    content: '';
    display: inline-block;
    width: 18px; height: 1.5px;
    background: #D4714E;
  }

  .uu-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 600;
    color: #2a1810;
    line-height: 1;
    letter-spacing: -0.5px;
  }

  .uu-subtitle {
    margin-top: 6px;
    font-size: 13px;
    color: #b09080;
    font-weight: 400;
  }

  /* avatar strip */
  .uu-avatar-strip {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 40px;
    background: #fdf8f5;
    border-bottom: 1px solid #f3ebe5;
    animation: uu-rise 0.6s 0.08s cubic-bezier(0.22,1,0.36,1) both;
  }

  .uu-avatar {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, #D4714E, #e8956e);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(212,113,78,0.35);
  }

  .uu-avatar-info {}
  .uu-avatar-name {
    font-size: 15px;
    font-weight: 500;
    color: #2a1810;
  }
  .uu-avatar-label {
    font-size: 12px;
    color: #b09080;
    margin-top: 2px;
  }

  /* form */
  .uu-form {
    padding: 32px 40px 36px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  /* two column row */
  .uu-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* field */
  .uu-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    animation: uu-rise 0.45s cubic-bezier(0.22,1,0.36,1) both;
  }

  .uu-field:nth-child(1) { animation-delay: 0.10s; }
  .uu-field:nth-child(2) { animation-delay: 0.15s; }
  .uu-field:nth-child(3) { animation-delay: 0.20s; }
  .uu-field:nth-child(4) { animation-delay: 0.25s; }
  .uu-field:nth-child(5) { animation-delay: 0.30s; }

  .uu-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: #9b7b6a;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .uu-label svg { opacity: 0.65; }

  .uu-input,
  .uu-textarea {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #ead9d0;
    border-radius: 12px;
    background: #fdf8f5;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    color: #2a1810;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .uu-input:focus,
  .uu-textarea:focus {
    border-color: #D4714E;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(212,113,78,0.12);
  }

  .uu-input::placeholder,
  .uu-textarea::placeholder {
    color: #cbb8af;
    font-size: 13px;
  }

  .uu-textarea {
    resize: none;
    min-height: 100px;
    line-height: 1.6;
  }

  /* password hint */
  .uu-hint {
    font-size: 11.5px;
    color: #c0a898;
    margin-top: -4px;
    font-style: italic;
  }

  /* divider */
  .uu-divider {
    height: 1px;
    background: #f3ebe5;
  }

  /* actions */
  .uu-actions {
    display: flex;
    gap: 12px;
    animation: uu-rise 0.5s 0.35s cubic-bezier(0.22,1,0.36,1) both;
  }

  .uu-btn {
    flex: 1;
    padding: 14px 20px;
    border-radius: 14px;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: transform 0.13s, box-shadow 0.15s, background 0.15s, opacity 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .uu-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .uu-btn-cancel {
    background: #fdf0ea;
    color: #D4714E;
    border: 1.5px solid #f0c4ae;
    flex: 0 0 auto;
    padding: 14px 22px;
  }
  .uu-btn-cancel:hover:not(:disabled) {
    background: #f5e0d5;
    transform: translateY(-1px);
  }

  .uu-btn-save {
    background: linear-gradient(135deg, #D4714E, #c05535);
    color: #fff;
    box-shadow: 0 4px 18px rgba(212,113,78,0.38);
  }
  .uu-btn-save:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212,113,78,0.45);
  }
  .uu-btn-save:active:not(:disabled) {
    transform: translateY(0);
  }

  /* spinner */
  .uu-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: uu-spin 0.7s linear infinite;
  }
  @keyframes uu-spin { to { transform: rotate(360deg); } }

  /* toast */
  .uu-toast {
    position: fixed;
    bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 13px 24px;
    border-radius: 50px;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
    z-index: 999;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 9px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.18);
  }
  .uu-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .uu-toast.success { background: #0f3320; color: #b8f0d0; }
  .uu-toast.error   { background: #3d1010; color: #ffcdc8; }

  /* loading skeleton */
  .uu-skeleton {
    height: 46px;
    border-radius: 12px;
    background: linear-gradient(90deg, #f3ebe5 25%, #fdf0ea 50%, #f3ebe5 75%);
    background-size: 200% 100%;
    animation: uu-shimmer 1.4s ease infinite;
  }
  .uu-skeleton-sm { height: 36px; }
  .uu-skeleton-lg { height: 100px; }

  @keyframes uu-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 560px) {
    .uu-header, .uu-form, .uu-avatar-strip { padding-left: 24px; padding-right: 24px; }
    .uu-row { grid-template-columns: 1fr; }
    .uu-title { font-size: 30px; }
  }
`;

// Icons
const IconUser  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>;
const IconMail  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconLock  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconPhone = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>;
const IconPin   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconSave  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconBack  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;

// function getInitials(name = '') {
//   return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
// }

export default function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '', show: false });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    axios.get(`http://localhost:7000/user/getUserById/${id}`)
      .then((res) => {
        // ✅ handles both res.data.data and res.data shapes
        const user = res.data?.data ?? res.data?.user ?? res.data;
        const { name = '', email = '', phone = '', address = '' } = user || {};
        setFormData({ name, email, phone, address, password: '' });
      })
      .catch((err) => {
        console.log(err);
        showToast('Failed to load user data.', 'error');
      })
      .finally(() => setPageLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.email) {
      showToast('Name and email are required.', 'error');
      return;
    }
    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        ...(formData.password && { password: formData.password }),
      };
      await axios.put(`http://localhost:7000/user/updateUser/${id}`, updateData);
      showToast('User updated successfully!', 'success');
      setTimeout(() => navigate('/Admin/ViewUser'), 1500);
    } catch (err) {
      console.log(err);
      showToast('Failed to update user.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="uu-root">
        <div className="uu-blob uu-blob-1" />
        <div className="uu-blob uu-blob-2" />
        <div className="uu-blob uu-blob-3" />

        <div className="uu-card">
          <div className="uu-bar" />

          {/* Header */}
          <div className="uu-header">
            <p className="uu-eyebrow">CraftNest Admin</p>
            <h1 className="uu-title">Update User</h1>
            <p className="uu-subtitle">Update the details below and save your changes.</p>
          </div>

          {/* Avatar strip */}
          {/* <div className="uu-avatar-strip">
            <div className="uu-avatar">{getInitials(formData.name)}</div>
            <div className="uu-avatar-info">
              <div className="uu-avatar-name">{formData.name || 'Loading…'}</div>
              <div className="uu-avatar-label">{formData.email || 'user@email.com'}</div>
            </div>
          </div> */}

          {/* Form */}
          <div className="uu-form">
            {pageLoading ? (
              // Skeleton
              <>
                <div className="uu-row">
                  <div className="uu-field"><div className="uu-skeleton-sm uu-skeleton" /><div className="uu-skeleton" /></div>
                  <div className="uu-field"><div className="uu-skeleton-sm uu-skeleton" /><div className="uu-skeleton" /></div>
                </div>
                <div className="uu-field"><div className="uu-skeleton-sm uu-skeleton" /><div className="uu-skeleton" /></div>
                <div className="uu-row">
                  <div className="uu-field"><div className="uu-skeleton-sm uu-skeleton" /><div className="uu-skeleton" /></div>
                  <div className="uu-field"><div className="uu-skeleton-sm uu-skeleton" /><div className="uu-skeleton" /></div>
                </div>
                <div className="uu-field"><div className="uu-skeleton-sm uu-skeleton" /><div className="uu-skeleton uu-skeleton-lg" /></div>
              </>
            ) : (
              <>
                {/* Name + Email */}
                <div className="uu-row">
                  <div className="uu-field">
                    <label className="uu-label"><IconUser /> Full Name</label>
                    <input className="uu-input" type="text" name="name" placeholder="Jane Doe" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="uu-field">
                    <label className="uu-label"><IconMail /> Email</label>
                    <input className="uu-input" type="email" name="email" placeholder="jane@example.com" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                {/* Password */}
                <div className="uu-field">
                  <label className="uu-label"><IconLock /> New Password</label>
                  <input className="uu-input" type="password" name="password" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} />
                  <p className="uu-hint">Only fill this if you want to change the password.</p>
                </div>

                {/* Phone */}
                <div className="uu-field">
                  <label className="uu-label"><IconPhone /> Phone</label>
                  <input className="uu-input" type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
                </div>

                {/* Address */}
                <div className="uu-field">
                  <label className="uu-label"><IconPin /> Address</label>
                  <textarea className="uu-textarea" name="address" placeholder="Street, City, State, PIN" value={formData.address} onChange={handleChange} />
                </div>

                <div className="uu-divider" />

                {/* Actions */}
                <div className="uu-actions">
                  <button className="uu-btn uu-btn-cancel" onClick={() => navigate('/Admin/ViewUser')} disabled={saving}>
                    <IconBack /> Back
                  </button>
                  <button className="uu-btn uu-btn-save" onClick={handleUpdate} disabled={saving}>
                    {saving ? <><div className="uu-spinner" /> Saving…</> : <><IconSave /> Save Changes</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Toast */}
        <div className={`uu-toast ${toast.type} ${toast.show ? 'show' : ''}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      </div>
    </>
  );
}
