import React, { useState } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

  .au-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .au-root {
    min-height: 100vh;
    background: #fdf6f0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .au-root::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, #f5c9b3 0%, transparent 70%);
    pointer-events: none;
  }

  .au-root::after {
    content: '';
    position: absolute;
    bottom: -100px; left: -100px;
    width: 350px; height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, #e8d5c4 0%, transparent 70%);
    pointer-events: none;
  }

  .au-card {
    background: #ffffff;
    border-radius: 24px;
    width: 100%;
    max-width: 520px;
    box-shadow: 0 8px 40px rgba(180, 100, 60, 0.12), 0 2px 8px rgba(0,0,0,0.04);
    overflow: hidden;
    position: relative;
    z-index: 1;
    animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .au-header {
    background: linear-gradient(135deg, #D4714E 0%, #c25a38 100%);
    padding: 36px 40px 32px;
    position: relative;
    overflow: hidden;
  }

  .au-header::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
  }

  .au-header::before {
    content: '';
    position: absolute;
    bottom: -60px; right: 60px;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }

  .au-brand {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .au-title {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.2;
  }

  .au-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.72);
    margin-top: 6px;
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  .au-body {
    padding: 36px 40px 40px;
  }

  .au-field {
    margin-bottom: 22px;
    animation: fadeIn 0.4s ease both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .au-field:nth-child(1) { animation-delay: 0.05s; }
  .au-field:nth-child(2) { animation-delay: 0.1s; }
  .au-field:nth-child(3) { animation-delay: 0.15s; }
  .au-field:nth-child(4) { animation-delay: 0.2s; }
  .au-field:nth-child(5) { animation-delay: 0.25s; }

  .au-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #9b7b6a;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .au-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .au-icon {
    position: absolute;
    left: 14px;
    color: #c8a090;
    font-size: 16px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .au-input {
    width: 100%;
    padding: 13px 16px 13px 42px;
    border: 1.5px solid #eaddd6;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: #3d2b22;
    background: #fdf8f6;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    -webkit-appearance: none;
  }

  .au-input::placeholder { color: #c8b0a6; }

  .au-input:focus {
    border-color: #D4714E;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(212, 113, 78, 0.12);
  }

  .au-textarea {
    width: 100%;
    padding: 13px 16px 13px 42px;
    border: 1.5px solid #eaddd6;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    color: #3d2b22;
    background: #fdf8f6;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    resize: none;
    min-height: 110px;
  }

  .au-textarea::placeholder { color: #c8b0a6; }

  .au-textarea:focus {
    border-color: #D4714E;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(212, 113, 78, 0.12);
  }

  .au-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #eaddd6, transparent);
    margin: 8px 0 24px;
  }

  .au-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #D4714E 0%, #c25a38 100%);
    color: #ffffff;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 16px rgba(212, 113, 78, 0.35);
    margin-top: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .au-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(212, 113, 78, 0.45);
  }

  .au-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(212, 113, 78, 0.3);
  }

  .au-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .au-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.4);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .au-toast {
    position: fixed;
    bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #2e1a14;
    color: #fff;
    padding: 12px 22px;
    border-radius: 40px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
    z-index: 999;
    white-space: nowrap;
  }

  .au-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .au-toast.error { background: #7a1f1f; }
  .au-toast.success { background: #1a4a2e; }

  .au-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    .au-card { border-radius: 20px; }
    .au-header { padding: 28px 24px; }
    .au-body { padding: 28px 24px 32px; }
    .au-field-row { grid-template-columns: 1fr; gap: 0; }
  }
`;

const icons = {
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
    </svg>
  ),
  map: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
};

export default function AddUser() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '', show: false });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:7000/user/registerUser", formData);
      console.log("Registered user:", res.data);
      showToast('User added successfully!', 'success');
      setFormData({ name: '', email: '', password: '', phone: '', address: '' });
    } catch (err) {
      console.log("Full error:", err.response?.data);
      console.log("Status:", err.response?.status);
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="au-root">
        <div className="au-card">

          {/* Header */}
          <div className="au-header">
            <p className="au-brand">CraftNest</p>
            <h1 className="au-title">Add New User</h1>
            <p className="au-subtitle">Fill in the details to register a new member</p>
          </div>

          {/* Body */}
          <div className="au-body">

            {/* Name + Email row */}
            <div className="au-field-row">
              <div className="au-field">
                <label className="au-label">Full Name</label>
                <div className="au-input-wrap">
                  <span className="au-icon">{icons.user}</span>
                  <input className="au-input" type="text" name="name" placeholder="John Doe"
                    value={formData.name} onChange={handleChange} />
                </div>
              </div>
              <div className="au-field">
                <label className="au-label">Phone</label>
                <div className="au-input-wrap">
                  <span className="au-icon">{icons.phone}</span>
                  <input className="au-input" type="tel" name="phone" placeholder="+91 98765 43210"
                    value={formData.phone} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="au-field">
              <label className="au-label">Email Address</label>
              <div className="au-input-wrap">
                <span className="au-icon">{icons.email}</span>
                <input className="au-input" type="email" name="email" placeholder="john@example.com"
                  value={formData.email} onChange={handleChange} />
              </div>
            </div>

            <div className="au-field">
              <label className="au-label">Password</label>
              <div className="au-input-wrap">
                <span className="au-icon">{icons.lock}</span>
                <input className="au-input" type="password" name="password" placeholder="Min. 8 characters"
                  value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <div className="au-field">
              <label className="au-label">Address</label>
              <div className="au-input-wrap" style={{ alignItems: 'flex-start' }}>
                <span className="au-icon" style={{ top: '13px', position: 'absolute' }}>{icons.map}</span>
                <textarea className="au-textarea" name="address" placeholder="Street, City, State..."
                  value={formData.address} onChange={handleChange} />
              </div>
            </div>

            <div className="au-divider" />

            <button className="au-btn" onClick={handleRegister} disabled={loading}>
              {loading
                ? <><div className="au-spinner" /> Adding User...</>
                : <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                    Add User
                  </>
              }
            </button>

          </div>
        </div>

        {/* Toast */}
        <div className={`au-toast ${toast.type} ${toast.show ? 'show' : ''}`}>
          {toast.msg}
        </div>
      </div>
    </>
  );
}
