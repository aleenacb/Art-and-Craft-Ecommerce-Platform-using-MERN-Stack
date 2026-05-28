import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const profileRef = useRef();
  const coverRef = useRef();

  // ✅ YOUR ORIGINAL BACKEND FETCH — UNCHANGED
  useEffect(() => {
    const token = localStorage.getItem('UserToken') || localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    axios.get('http://localhost:7000/user/getProfile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      const user = res.data.user || res.data;
      setFormData({
        name: user.name || '', email: user.email || '',
        password: '', phone: user.phone || '', address: user.address || ''
      });
      if (user.profileimage) setPreviewProfile(`http://localhost:7000/uploads/${user.profileimage}`);
    }).catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfileImg = (e) => {
    const file = e.target.files[0];
    if (file) { setProfileImage(file); setPreviewProfile(URL.createObjectURL(file)); }
  };

  const handleCoverImg = (e) => {
    const file = e.target.files[0];
    if (file) { setCoverImage(file); setPreviewCover(URL.createObjectURL(file)); }
  };

  // ✅ YOUR ORIGINAL BACKEND SUBMIT — UNCHANGED
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('UserToken') || localStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (formData.password) data.append('password', formData.password);
      if (profileImage) data.append('profileimage', profileImage);
      if (coverImage) data.append('coverimage', coverImage);

      await axios.put('http://localhost:7000/user/updateProfile', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      console.log(err);
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');

        .craft-page {
          min-height: 100vh;
          background: #FDF6EE;
          font-family: 'Lato', sans-serif;
          padding: 2rem 1rem 4rem;
          position: relative;
        }

        .craft-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at 10% 20%, rgba(210,120,60,0.08) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(139,90,43,0.07) 0%, transparent 40%);
          pointer-events: none;
          z-index: 0;
        }

        .deco-top {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 6px;
          z-index: 999;
          background: repeating-linear-gradient(90deg,
            #C8693A 0px, #C8693A 24px,
            #E8A96A 24px, #E8A96A 48px,
            #8B5A2B 48px, #8B5A2B 72px,
            #D4956B 72px, #D4956B 96px
          );
        }

        .craft-card {
          max-width: 600px;
          margin: 1.5rem auto 0;
          background: #FFFDF9;
          border-radius: 2px;
          border: 1px solid #E8D5B7;
          box-shadow: 5px 5px 0 #C8693A;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        .card-header {
          background: #2C1A0E;
          padding: 2rem 2.5rem 1.8rem;
          position: relative;
          overflow: hidden;
        }

        .card-header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 4px;
          background: repeating-linear-gradient(90deg,
            #C8693A 0, #C8693A 10px,
            #E8A96A 10px, #E8A96A 20px
          );
        }

        .header-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #C8693A;
          margin-bottom: 6px;
        }

        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 400;
          color: #FDF6EE;
          line-height: 1.2;
        }

        .header-title em { font-style: italic; color: #E8A96A; }

        .header-sub {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(253,246,238,0.45);
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .deco-watermark {
          position: absolute;
          right: 2rem; top: 50%;
          transform: translateY(-50%) rotate(-20deg);
          font-size: 72px;
          opacity: 0.06;
          color: #FDF6EE;
          pointer-events: none;
          line-height: 1;
        }

        .card-body { padding: 2rem 2.5rem 2.5rem; }

        /* ── Avatar ── */
        .avatar-section {
          display: flex;
          align-items: center;
          gap: 1.8rem;
          padding-bottom: 2rem;
          margin-bottom: 2rem;
          border-bottom: 1px dashed #E2CEB0;
        }

        .avatar-wrap { position: relative; flex-shrink: 0; }

        .avatar-ring {
          width: 96px; height: 96px;
          border-radius: 50%;
          border: 3px solid #C8693A;
          padding: 4px;
          background: #FFFDF9;
        }

        .avatar-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #F5DEB3, #DEB887);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-inner img { width: 100%; height: 100%; object-fit: cover; }

        .avatar-badge {
          position: absolute;
          bottom: 3px; right: 3px;
          width: 28px; height: 28px;
          background: #C8693A;
          border-radius: 50%;
          border: 2.5px solid #FFFDF9;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }

        .avatar-badge:hover { background: #8B5A2B; transform: scale(1.1); }

        .avatar-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #2C1A0E;
          font-weight: 400;
          margin-bottom: 3px;
        }

        .avatar-role {
          font-size: 11px;
          color: #9B7B5A;
          font-weight: 300;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .photo-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          background: transparent;
          border: 1px solid #C8693A;
          border-radius: 1px;
          font-family: 'Lato', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C8693A;
          cursor: pointer;
          transition: all 0.2s;
        }

        .photo-btn:hover { background: #C8693A; color: #FFFDF9; }

        /* ── Section Labels ── */
        .sec-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C8693A;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.2rem;
        }

        .sec-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, #E8D5B7, transparent);
        }

        /* ── Fields ── */
        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .field { margin-bottom: 1.2rem; }

        .field-lbl {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8B5A2B;
          margin-bottom: 6px;
        }

        .field-inp {
          width: 100%;
          padding: 11px 14px;
          background: #FDF8F2;
          border: 1px solid #D9C4A3;
          border-radius: 1px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: #2C1A0E;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .field-inp:focus {
          background: #FFFDF9;
          border-color: #C8693A;
          box-shadow: 3px 3px 0 rgba(200,105,58,0.15);
        }

        .field-inp::placeholder { color: #C9AA82; }

        textarea.field-inp {
          resize: vertical;
          min-height: 95px;
          line-height: 1.7;
        }

        /* ── Cover Upload ── */
        .cover-preview-img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border: 1px solid #D9C4A3;
          border-radius: 2px;
          margin-bottom: 1rem;
          display: block;
        }

        .cover-drop {
          border: 1.5px dashed #C8693A;
          background: #FDF6EE;
          border-radius: 2px;
          padding: 1.8rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: background 0.2s;
          margin-bottom: 1.5rem;
        }

        .cover-drop:hover { background: #F5E6D3; }

        .cover-icon-wrap {
          width: 40px; height: 40px;
          background: rgba(200,105,58,0.12);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
        }

        .cover-drop p { font-size: 13px; color: #7A5535; font-weight: 400; }
        .cover-drop span { font-size: 11px; color: #B89A72; margin-top: 3px; display: block; }

        /* ── Divider ── */
        .craft-divider {
          border: none;
          border-top: 1px dashed #E2CEB0;
          margin: 1.8rem 0;
        }

        /* ── Buttons ── */
        .btn-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px dashed #E2CEB0;
        }

        .btn-primary {
          flex: 1;
          padding: 15px 24px;
          background: #C8693A;
          border: none;
          border-radius: 1px;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FDF6EE;
          cursor: pointer;
          box-shadow: 4px 4px 0 #7A3D1A;
          transition: all 0.15s ease;
          position: relative;
        }

        .btn-primary:hover {
          background: #A8552E;
          box-shadow: 2px 2px 0 #7A3D1A;
          transform: translate(2px, 2px);
        }

        .btn-primary:active {
          transform: translate(4px, 4px);
          box-shadow: none;
        }

        .btn-primary:disabled {
          background: #C9AA82;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }

        .btn-secondary {
          padding: 15px 22px;
          background: transparent;
          border: 1px solid #C9AA82;
          border-radius: 1px;
          font-family: 'Lato', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8B5A2B;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover { border-color: #C8693A; color: #C8693A; }

        /* ── Toast ── */
        .craft-toast {
          position: fixed;
          bottom: 2rem; right: 2rem;
          background: #2C1A0E;
          color: #FDF6EE;
          padding: 14px 22px;
          border-left: 4px solid #C8693A;
          font-family: 'Lato', sans-serif;
          font-size: 13px;
          letter-spacing: 0.03em;
          border-radius: 1px;
          z-index: 9999;
          transform: translateY(100px);
          opacity: 0;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .craft-toast.show { transform: translateY(0); opacity: 1; }
      `}</style>

      <div className="craft-page">
        <div className="deco-top" />

        <div className="craft-card">

          {/* ── Header ── */}
          <div className="card-header">
            <div className="header-eyebrow">✦ Artisan Profile</div>
            <div className="header-title">Your <em>Creative</em> Identity</div>
            <div className="header-sub">Manage your account & showcase your craft</div>
            <div className="deco-watermark">✂</div>
          </div>

          <div className="card-body">

            {/* ── Avatar ── */}
            <div className="avatar-section">
              <div className="avatar-wrap">
                <div className="avatar-ring">
                  <div className="avatar-inner">
                    {previewProfile ? (
                      <img src={previewProfile} alt="Profile" />
                    ) : (
                      <svg width="46" height="46" viewBox="0 0 44 44" fill="none">
                        <circle cx="22" cy="17" r="8" fill="#8B5A2B" />
                        <path d="M6 40 C6 28 38 28 38 40" fill="#8B5A2B" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="avatar-badge" onClick={() => profileRef.current.click()}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2.5 10h8M8 3L3 8M8 3l2.5 2.5M8 3L5.5 5.5"
                      stroke="#FDF6EE" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <input ref={profileRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handleProfileImg} />
              </div>

              <div>
                <div className="avatar-name">{formData.name || 'Your Name'}</div>
                <div className="avatar-role">Artisan & Creator</div>
                <button className="photo-btn" onClick={() => profileRef.current.click()}>
                  ↑ Change Photo
                </button>
              </div>
            </div>

            {/* ── Personal Details ── */}
            <div className="sec-label">Personal Details</div>

            <div className="field-grid">
              <div className="field">
                <label className="field-lbl">Full Name</label>
                <input className="field-inp" type="text" name="name"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name} onChange={handleChange} />
              </div>
              <div className="field">
                <label className="field-lbl">Phone</label>
                <input className="field-inp" type="tel" name="phone"
                  placeholder="+91 98765 43210" maxLength={15}
                  value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="field">
              <label className="field-lbl">Email Address</label>
              <input className="field-inp" type="email" name="email"
                placeholder="you@artisanstudio.com"
                value={formData.email} onChange={handleChange} />
            </div>

            <div className="field">
              <label className="field-lbl">New Password</label>
              <input className="field-inp" type="password" name="password"
                placeholder="Leave blank to keep current"
                value={formData.password} onChange={handleChange} />
            </div>

            <hr className="craft-divider" />

            {/* ── Address ── */}
            <div className="sec-label">Shipping Address</div>
            <div className="field">
              <textarea className="field-inp" name="address"
                placeholder="Street, City, State, PIN Code"
                value={formData.address} onChange={handleChange} />
            </div>

            <hr className="craft-divider" />

            {/* ── Cover Image ── */}
            <div className="sec-label">Cover Image</div>

            {previewCover && (
              <img src={previewCover} alt="Cover Preview" className="cover-preview-img" />
            )}

            <div className="cover-drop" onClick={() => coverRef.current.click()}>
              <div className="cover-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1.5" y="3.5" width="15" height="11" rx="1.5"
                    stroke="#C8693A" strokeWidth="1.3" />
                  <circle cx="6" cy="7.5" r="1.8"
                    stroke="#C8693A" strokeWidth="1.3" />
                  <path d="M1.5 12.5l4.5-4.5 3.5 3.5 2.5-2.5 5 5.5"
                    stroke="#C8693A" strokeWidth="1.3"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p>Click to upload a cover image</p>
              <span>JPG or PNG · Max 5MB</span>
              <input ref={coverRef} type="file" accept="image/*"
                style={{ display: 'none' }} onChange={handleCoverImg} />
            </div>

            {/* ── Actions ── */}
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => window.history.back()}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : '✦ Save Changes'}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className={`craft-toast ${toast ? 'show' : ''}`}>
        ✦ Profile updated successfully!
      </div>
    </>
  );
}