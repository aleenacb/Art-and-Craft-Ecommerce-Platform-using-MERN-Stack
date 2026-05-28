import React, { useState } from 'react'
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    console.log("Form data:", formData);
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      alert("Please fill in all fields.");
      return;
    }
    axios.post("http://localhost:7000/user/registerUser", formData)
      .then((res) => {
        console.log("Registered:", res.data);
        alert("Registration successful!");
      })
      .catch((error) => {
        console.log("Error:", error.response?.data);
        alert(error.response?.data?.message || "Registration failed.");
      });
  };

  const styles = {
    wrap: {
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem',
      background: '#f5f0eb', fontFamily: "'DM Sans', sans-serif"
    },
    card: {
      background: '#fff', borderRadius: '20px',
      boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
      width: '100%', maxWidth: '500px', overflow: 'hidden'
    },
    header: {
      background: '#D4714E', padding: '2rem 2rem 2.5rem', position: 'relative'
    },
    headerCurve: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: '24px', background: '#fff', borderRadius: '20px 20px 0 0'
    },
    brand: {
      fontFamily: "'Playfair Display', serif", fontSize: '26px',
      fontWeight: 600, color: '#fff', letterSpacing: '-0.5px'
    },
    tagline: { fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '4px' },
    body: { padding: '1.5rem 2rem 2rem' },
    title: {
      fontFamily: "'Playfair Display', serif", fontSize: '20px',
      fontWeight: 500, color: '#1a1a1a', marginBottom: '1.5rem'
    },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    label: {
      display: 'block', fontSize: '11px', fontWeight: 500,
      color: '#888', letterSpacing: '0.06em',
      textTransform: 'uppercase', marginBottom: '5px'
    },
    input: {
      width: '100%', background: '#faf8f6', border: '0.5px solid #e0dbd5',
      borderRadius: '10px', padding: '10px 14px', fontSize: '14px',
      fontFamily: "'DM Sans', sans-serif", color: '#1a1a1a',
      outline: 'none', boxSizing: 'border-box'
    },
    textarea: {
      width: '100%', background: '#faf8f6', border: '0.5px solid #e0dbd5',
      borderRadius: '10px', padding: '10px 14px', fontSize: '14px',
      fontFamily: "'DM Sans', sans-serif", color: '#1a1a1a',
      outline: 'none', resize: 'none', height: '80px',
      lineHeight: 1.5, boxSizing: 'border-box'
    },
    btn: {
      width: '100%', padding: '13px', background: '#D4714E', color: '#fff',
      border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', marginTop: '6px'
    },
    divider: { height: '0.5px', background: '#eee', margin: '1.25rem 0' },
    footer: { fontSize: '13px', color: '#888', textAlign: 'center' },
    link: { color: '#D4714E', textDecoration: 'none', fontWeight: 500 }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.brand}>CraftNest</div>
            <div style={styles.tagline}>Handcrafted goods, delivered with care</div>
            <div style={styles.headerCurve} />
          </div>
          <div style={styles.body}>
            <div style={styles.title}>Create your account</div>
            <div style={{ marginBottom: '14px' }}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} type="text" name="name" placeholder="Enter your name" onChange={handleChange} />
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={styles.label}>Email Address</label>
              <input style={styles.input} type="email" name="email" placeholder="Enter your email" onChange={handleChange} />
            </div>
            <div style={{ ...styles.row, marginBottom: '14px' }}>
              <div>
                <label style={styles.label}>Password</label>
                <input style={styles.input} type="password" name="password" placeholder="••••••••" onChange={handleChange} />
              </div>
              <div>
                <label style={styles.label}>Phone</label>
                <input style={styles.input} type="tel" name="phone" placeholder="+91 XXXXXXXXX" onChange={handleChange} />
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={styles.label}>Address</label>
              <textarea style={styles.textarea} name="address" placeholder="Address" onChange={handleChange} />
            </div>
            <button style={styles.btn} onClick={handleRegister}>Create Account</button>
            <div style={styles.divider} />
            <div style={styles.footer}>
              Already have an account? <a href="/Users/Login" style={styles.link}>Sign in</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}