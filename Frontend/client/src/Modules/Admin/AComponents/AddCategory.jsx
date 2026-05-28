import { useState } from 'react';
import axios from 'axios';

export default function AddCategory() {
  const [category, setCategory] = useState({ categoryName: "", description: "" });

  const handleChange = (e) => setCategory({ ...category, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!category.categoryName || !category.description) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post("http://localhost:7000/category/addCategory", category);
      console.log(res.data);
      alert("Category Added Successfully!");
      setCategory({ categoryName: "", description: "" });
    } catch (error) {
      console.log(error);
      alert("Error adding category");
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.topBar} />
        <div style={styles.header}>
          <span style={styles.tag}>Category Management</span>
          <h2 style={styles.title}>
            Add <span style={{ color: '#D4714E' }}>Category</span>
          </h2>
        </div>
        <div style={styles.body}>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Category Name *</label>
            <input
              style={styles.input}
              name="categoryName"
              value={category.categoryName}
              onChange={handleChange}
              placeholder="e.g. Electronics, Clothing..."
            />
            <span style={styles.hint}>{category.categoryName.length} / 50</span>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              style={{ ...styles.input, resize: 'none' }}
              rows={4}
              name="description"
              value={category.description}
              onChange={handleChange}
              placeholder="Briefly describe this category..."
            />
            <span style={styles.hint}>{category.description.length} / 200</span>
          </div>

          <div style={styles.btnRow}>
            <button style={styles.btnCancel} onClick={() => window.history.back()}>
              Cancel
            </button>
            <button style={styles.btnSubmit} onClick={handleSubmit}>
              Add Category
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #FDF3E7 0%, #FAE0C8 60%, #F5C9A0 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px', fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    width: '100%', maxWidth: 440,
    background: 'white',
    border: '0.5px solid rgba(212,113,78,0.2)',
    borderRadius: 20, overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(212,113,78,0.12)',
  },
  topBar: {
    height: 4,
    background: 'linear-gradient(90deg, #D4714E, #EF9F27, #D4537E)',
  },
  header: {
    padding: '28px 32px 20px',
    borderBottom: '0.5px solid rgba(212,113,78,0.1)',
  },
  tag: {
    display: 'inline-block',
    background: 'rgba(212,113,78,0.1)',
    border: '0.5px solid rgba(212,113,78,0.25)',
    borderRadius: 20, padding: '4px 14px',
    fontSize: 10, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: '#993C1D', marginBottom: 12,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 26, fontWeight: 700, color: '#412402', margin: 0,
  },
  body: {
    padding: '24px 32px 32px',
    display: 'flex', flexDirection: 'column', gap: 18,
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: {
    fontSize: 10, letterSpacing: '0.13em',
    textTransform: 'uppercase', color: '#BA7517', fontWeight: 500,
  },
  input: {
    background: '#FDF8F2',
    border: '0.5px solid rgba(212,113,78,0.25)',
    borderRadius: 10, padding: '12px 16px',
    color: '#412402', fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  hint: {
    fontSize: 11, color: '#BA7517', opacity: 0.5, textAlign: 'right',
  },
  btnRow: {
    display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 10, marginTop: 4,
  },
  btnCancel: {
    background: 'transparent',
    border: '0.5px solid rgba(212,113,78,0.3)',
    borderRadius: 12, padding: 13,
    color: '#D4714E', fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, cursor: 'pointer',
  },
  btnSubmit: {
    background: 'linear-gradient(135deg, #D4714E, #EF9F27)',
    border: 'none', borderRadius: 12, padding: 13,
    color: 'white', fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, fontWeight: 600,
    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(212,113,78,0.35)',
  },
};