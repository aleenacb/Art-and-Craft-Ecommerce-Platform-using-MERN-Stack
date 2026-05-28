import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

export default function UpdateProduct() {   // ✅ Capital U — fixes blank screen

  const { id } = useParams()               // ✅ get product ID from URL

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    productimage: null
  })

  // ✅ Fetch PRODUCT not profile
  useEffect(() => {
    const token = localStorage.getItem("UserToken") || localStorage.getItem("token")
    console.log("ID from URL:", id)
console.log("Token:", localStorage.getItem("UserToken") || localStorage.getItem("token"))
    if (!token) {
      alert("Please login first")
      window.location.href = "/login"
      return
    }

    axios.get(`http://localhost:7000/product/getProductById/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      const product = res.data.data || res.data.product || res.data

      setFormData({
        productName: product.productName || product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        stock: product.stock || '',
        productimage: null
      })
    })
    .catch((err) => {
      console.log(err)
      alert("Failed to load product")
    })
  }, [id])

  const handleChange = (e) => {
    if (e.target.name === "productimage") {
      setFormData({ ...formData, productimage: e.target.files[0] })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  // ✅ Update PRODUCT not profile
  const handleUpdate = async () => {
    const token = localStorage.getItem("UserToken") || localStorage.getItem("token")

    if (!token) {
      alert("Please login first")
      return
    }

    try {
      const data = new FormData()
      data.append("productName", formData.productName)
      data.append("description", formData.description)
      data.append("price", formData.price)
      data.append("category", formData.category)
      data.append("stock", formData.stock)

      if (formData.productimage) {
        data.append("productimage", formData.productimage)
      }

      await axios.put(`http://localhost:7000/product/updateProduct/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      })

      alert("Product updated successfully!")

    } catch (error) {
      console.log(error)
      alert("Update failed")
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.topBar} />

        <div style={styles.header}>
          <span style={styles.tag}>Product Management</span>
          <h2 style={styles.title}>
            Update <span style={{ color: '#378ADD' }}>Product</span>
          </h2>
        </div>

        <div style={styles.body}>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Product Name</label>
              <input style={styles.input} name="productName"
                value={formData.productName} onChange={handleChange}
                placeholder="e.g. Nike Air Max" />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Price (₹)</label>
              <input style={styles.input} name="price" type="number"
                value={formData.price} onChange={handleChange}
                placeholder="e.g. 2999" />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Category</label>
              <input style={styles.input} name="category"
                value={formData.category} onChange={handleChange}
                placeholder="e.g. Footwear" />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Stock Quantity</label>
              <input style={styles.input} name="stock" type="number"
                value={formData.stock} onChange={handleChange}
                placeholder="e.g. 50" />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description</label>
            <textarea style={{ ...styles.input, resize: 'none' }} rows={4}
              name="description" value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product..." />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Product Image</label>
            <input style={{ ...styles.input, padding: '8px 14px', cursor: 'pointer' }}
              type="file" name="productimage" accept="image/*"
              onChange={handleChange} />
          </div>

          <div style={styles.btnRow}>
            <button style={styles.btnCancel}
              onClick={() => window.history.back()}>
              Cancel
            </button>
            <button style={styles.btnSubmit} onClick={handleUpdate}>
              Update Product
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #06101a 0%, #0b1f2e 60%, #06101a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px 20px', fontFamily: "'DM Sans', sans-serif"
  },
  card: {
    width: '100%', maxWidth: 520,
    background: 'rgba(55,138,221,0.05)',
    border: '0.5px solid rgba(55,138,221,0.2)',
    borderRadius: 20, overflow: 'hidden', position: 'relative'
  },
  topBar: {
    height: 3,
    background: 'linear-gradient(90deg, transparent, #378ADD, #85B7EB, #378ADD, transparent)'
  },
  header: { padding: '28px 32px 20px', borderBottom: '0.5px solid rgba(55,138,221,0.12)' },
  tag: {
    display: 'inline-block',
    background: 'rgba(55,138,221,0.12)',
    border: '0.5px solid rgba(55,138,221,0.3)',
    borderRadius: 20, padding: '4px 14px',
    fontSize: 10, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: '#85B7EB', marginBottom: 12
  },
  title: {
    fontFamily: "'Syne', sans-serif", fontSize: 26,
    fontWeight: 700, color: '#B5D4F4', margin: 0
  },
  body: { padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: 18 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: {
    fontSize: 10, letterSpacing: '0.13em',
    textTransform: 'uppercase', color: 'rgba(55,138,221,0.55)', fontWeight: 500
  },
  input: {
    background: 'rgba(55,138,221,0.06)',
    border: '0.5px solid rgba(55,138,221,0.2)',
    borderRadius: 10, padding: '12px 16px',
    color: 'rgba(255,255,255,0.88)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, outline: 'none',
    width: '100%', boxSizing: 'border-box'
  },
  btnRow: { display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 10, marginTop: 4 },
  btnCancel: {
    background: 'transparent',
    border: '0.5px solid rgba(55,138,221,0.25)',
    borderRadius: 12, padding: 13,
    color: 'rgba(55,138,221,0.6)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, cursor: 'pointer'
  },
  btnSubmit: {
    background: 'linear-gradient(135deg, #185FA5, #378ADD)',
    border: 'none', borderRadius: 12, padding: 13,
    color: '#E6F1FB', fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer'
  },
}