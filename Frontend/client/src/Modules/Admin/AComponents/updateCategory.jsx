import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function UpdateCategory() {
  const { id } = useParams();
  const [category, setCategory] = useState({ categoryName: "", description: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:7000/category/getCategoryById/${id}`)
      .then((res) => {
        // ✅ safe fallback — handles any backend response shape
        const data = res.data.data || res.data.category || res.data
        setCategory({
          categoryName: data.categoryName || '',
          description: data.description || ''
        })
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        alert("Failed to load category")
        setLoading(false)
      });
  }, [id]);

  const handleChange = (e) => setCategory({ ...category, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:7000/category/UpdateCategoryById/${id}`, {
        categoryName: category.categoryName,
        description: category.description
      });
      alert("Category Updated Successfully");
    } catch (error) {
      console.log(error);
      alert("Error updating category");
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #06101a 0%, #0b1f2e 60%, #06101a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#378ADD', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.1em' }}>Loading...</p>
    </div>
  )

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.topBar} />
        <div style={styles.header}>
          <span style={styles.tag}>Category Management</span>
          <h2 style={styles.title}>Update <span style={{ color: '#378ADD' }}>Category</span></h2>
        </div>
        <div style={styles.body}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Category Name</label>
            <input
              style={styles.input}
              name="categoryName"
              value={category.categoryName}
              onChange={handleChange}
              placeholder="e.g. Electronics, Clothing..."
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, resize: 'none' }}
              rows={4}
              name="description"
              value={category.description}
              onChange={handleChange}
              placeholder="Briefly describe this category..."
            />
          </div>
          <div style={styles.btnRow}>
            <button style={styles.btnCancel} onClick={() => window.history.back()}>Cancel</button>
            <button style={styles.btnSubmit} onClick={handleUpdate}>Update Category</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: '100vh', background: 'linear-gradient(160deg, #06101a 0%, #0b1f2e 60%, #06101a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" },
  card: { width: '100%', maxWidth: 440, background: 'rgba(55,138,221,0.05)', border: '0.5px solid rgba(55,138,221,0.2)', borderRadius: 20, overflow: 'hidden', position: 'relative' },
  topBar: { height: 3, background: 'linear-gradient(90deg, transparent, #378ADD, #85B7EB, #378ADD, transparent)' },
  header: { padding: '28px 32px 20px', borderBottom: '0.5px solid rgba(55,138,221,0.12)' },
  tag: { display: 'inline-block', background: 'rgba(55,138,221,0.12)', border: '0.5px solid rgba(55,138,221,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#85B7EB', marginBottom: 12 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 700, color: '#B5D4F4', margin: 0 },
  body: { padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: 18 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'rgba(55,138,221,0.55)', fontWeight: 500 },
  input: { background: 'rgba(55,138,221,0.06)', border: '0.5px solid rgba(55,138,221,0.2)', borderRadius: 10, padding: '12px 16px', color: 'rgba(255,255,255,0.88)', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' },
  btnRow: { display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 10, marginTop: 4 },
  btnCancel: { background: 'transparent', border: '0.5px solid rgba(55,138,221,0.25)', borderRadius: 12, padding: 13, color: 'rgba(55,138,221,0.6)', fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: 'pointer' },
  btnSubmit: { background: 'linear-gradient(135deg, #185FA5, #378ADD)', border: 'none', borderRadius: 12, padding: 13, color: '#E6F1FB', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' },
};