import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ap-root {
    min-height: 100vh;
    background: #fdf6f0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .ap-blob {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
    opacity: 0.35;
  }
  .ap-blob-1 { width: 500px; height: 500px; top: -180px; right: -150px; background: #f5c9b3; }
  .ap-blob-2 { width: 400px; height: 400px; bottom: -140px; left: -120px; background: #e8d5c4; }
  .ap-blob-3 { width: 300px; height: 300px; top: 40%; left: 30%; background: #fce8de; opacity: 0.2; }

  .ap-container {
    width: 100%;
    max-width: 640px;
    position: relative;
    z-index: 1;
    animation: ap-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes ap-rise {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ap-accent-bar {
    height: 4px;
    background: linear-gradient(90deg, #D4714E, #e8956e, #D4714E);
    background-size: 200% 100%;
    border-radius: 4px 4px 0 0;
    animation: ap-shimmer 3s ease infinite;
  }

  @keyframes ap-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .ap-card {
    background: #ffffff;
    border-radius: 0 0 28px 28px;
    box-shadow:
      0 2px 0 rgba(212,113,78,0.15),
      0 20px 60px rgba(180,100,60,0.1),
      0 4px 16px rgba(0,0,0,0.04);
    overflow: hidden;
  }

  .ap-header {
    padding: 40px 48px 36px;
    background: linear-gradient(160deg, #D4714E 0%, #ba5535 100%);
    position: relative;
    overflow: hidden;
  }

  .ap-header-deco {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
  }
  .ap-header-deco-1 { width: 220px; height: 220px; top: -80px; right: -60px; }
  .ap-header-deco-2 { width: 120px; height: 120px; bottom: -50px; right: 100px; }
  .ap-header-deco-3 { width: 80px; height: 80px; top: 20px; right: 160px; background: rgba(255,255,255,0.04); }

  .ap-eyebrow {
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ap-eyebrow::before {
    content: '';
    display: inline-block;
    width: 20px; height: 1.5px;
    background: rgba(255,255,255,0.5);
  }

  .ap-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 600;
    color: #ffffff;
    line-height: 1.1;
    letter-spacing: -0.5px;
  }

  .ap-subtitle {
    font-size: 14px;
    color: rgba(255,255,255,0.68);
    margin-top: 8px;
    font-weight: 300;
    letter-spacing: 0.2px;
  }

  .ap-steps { display: flex; gap: 6px; margin-top: 24px; }
  .ap-step-dot {
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.3);
    flex: 1;
    transition: background 0.3s;
  }
  .ap-step-dot.active { background: rgba(255,255,255,0.9); }

  .ap-body { padding: 40px 48px 44px; }

  .ap-section {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #D4714E;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ap-section::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, #eaddd6, transparent);
  }

  .ap-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .ap-field { margin-bottom: 20px; }

  .ap-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 500;
    color: #9b7b6a;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 9px;
  }

  .ap-required { color: #D4714E; font-size: 14px; line-height: 1; }

  .ap-input {
    width: 100%;
    padding: 13px 16px;
    border: 1.5px solid #eaddd6;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    color: #3d2b22;
    background: #fdf8f6;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    -webkit-appearance: none;
  }

  .ap-input::placeholder { color: #c8b0a6; font-weight: 300; }

  .ap-input:focus {
    border-color: #D4714E;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(212, 113, 78, 0.1);
  }

  .ap-input:hover:not(:focus) { border-color: #d4b5a8; }

  .ap-select {
    width: 100%;
    padding: 13px 40px 13px 16px;
    border: 1.5px solid #eaddd6;
    border-radius: 12px;
    font-size: 15px;
    font-family: 'Jost', sans-serif;
    font-weight: 400;
    color: #3d2b22;
    background: #fdf8f6;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23c8a090' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }

  .ap-select:focus {
    border-color: #D4714E;
    background-color: #ffffff;
    box-shadow: 0 0 0 4px rgba(212, 113, 78, 0.1);
  }

  .ap-cat-error {
    padding: 10px 14px;
    background: #fff4f0;
    border: 1px solid #f5c4b3;
    border-radius: 10px;
    font-size: 13px;
    color: #a04020;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ap-cat-retry {
    margin-left: auto;
    background: none;
    border: none;
    color: #D4714E;
    font-size: 13px;
    font-family: 'Jost', sans-serif;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
  }

  .ap-cat-loading {
    padding: 13px 16px;
    border: 1.5px solid #eaddd6;
    border-radius: 12px;
    font-size: 14px;
    color: #c8b0a6;
    background: #fdf8f6;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ap-mini-spinner {
    width: 14px; height: 14px;
    border: 2px solid #eaddd6;
    border-top-color: #D4714E;
    border-radius: 50%;
    animation: ap-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  .ap-file-zone {
    border: 1.5px dashed #d4b5a8;
    border-radius: 12px;
    background: #fdf8f6;
    padding: 24px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .ap-file-zone:hover { border-color: #D4714E; background: #fef2ec; transform: translateY(-1px); }

  .ap-file-zone.has-file {
    border-color: #D4714E;
    background: #fef2ec;
    border-style: solid;
  }

  .ap-file-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .ap-file-icon {
    width: 40px; height: 40px;
    margin: 0 auto 10px;
    background: linear-gradient(135deg, #D4714E22, #D4714E11);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #D4714E;
  }

  .ap-file-text { font-size: 14px; color: #9b7b6a; font-weight: 400; }
  .ap-file-text strong { color: #D4714E; font-weight: 500; }
  .ap-file-hint { font-size: 12px; color: #c8b0a6; margin-top: 4px; }

  .ap-file-name {
    font-size: 13px;
    color: #D4714E;
    font-weight: 500;
    margin-top: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 260px;
    margin-inline: auto;
  }

  .ap-input-prefix { position: relative; }

  .ap-prefix-symbol {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    color: #c8a090;
    font-weight: 500;
    pointer-events: none;
  }

  .ap-input-prefix .ap-input { padding-left: 30px; }

  .ap-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #eaddd6, transparent);
    margin: 28px 0;
  }

  .ap-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #D4714E 0%, #c05535 100%);
    color: #ffffff;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 500;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.8px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 6px 24px rgba(212, 113, 78, 0.4), 0 2px 6px rgba(212, 113, 78, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
  }

  .ap-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transition: left 0.5s;
  }

  .ap-btn:hover:not(:disabled)::before { left: 100%; }
  .ap-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(212,113,78,0.5); }
  .ap-btn:active:not(:disabled) { transform: translateY(0); }
  .ap-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .ap-spinner {
    width: 18px; height: 18px;
    border: 2.5px solid rgba(255,255,255,0.35);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: ap-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes ap-spin { to { transform: rotate(360deg); } }

  .ap-toast {
    position: fixed;
    bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(16px);
    padding: 13px 24px;
    border-radius: 50px;
    font-size: 14px;
    font-family: 'Jost', sans-serif;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
    z-index: 999;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }

  .ap-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .ap-toast.error   { background: #3d1010; color: #ffcdc8; }
  .ap-toast.success { background: #0f3320; color: #b8f0d0; }

  @media (max-width: 560px) {
    .ap-header { padding: 32px 28px; }
    .ap-body   { padding: 32px 28px 36px; }
    .ap-grid-2 { grid-template-columns: 1fr; }
    .ap-title  { font-size: 32px; }
  }
`;

// SVG Icons
const IconTag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
  </svg>
);

const IconBox = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
  </svg>
);

const IconDollar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const IconPackage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconImage = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const IconGrid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconWarn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

// Handles any API response shape: [], {data:[]}, {categories:[]}, {result:[]}
function extractCategories(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.categories)) return data.categories;
  if (data && Array.isArray(data.result)) return data.result;
  return [];
}

// Handles any field name: categoryName, name, category_name, title
function getCatName(cat) {
  return cat.categoryName || cat.name || cat.category_name || cat.title || '(unnamed)';
}

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: '',
    productimage: null,
  });

  const [category, setCategory] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '', show: false });
  const fileInputRef = useRef(null);

  const fetchCategories = () => {
    setCatLoading(true);
    setCatError('');
    axios.get("http://localhost:7000/category/getCategory")
      .then((res) => {
        const list = extractCategories(res.data);
        if (list.length === 0) {
          setCatError('No categories found. Please add categories first.');
        }
        setCategory(list);
      })
      .catch((err) => {
        const status = err.response?.status || '?';
        const msg = err.response?.data?.message || err.message || 'Unknown error';
        console.error("Category fetch error:", err.response?.data || err);
        setCatError(`Server error (${status}): ${msg}`);
      })
      .finally(() => setCatLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === 'productimage') {
      setProduct(prev => ({ ...prev, productimage: files[0] || null }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.quantity || !product.categoryId) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("quantity", product.quantity);
      formData.append("categoryId", product.categoryId);
      if (product.productimage) formData.append("productimage", product.productimage);

      await axios.post("http://localhost:7000/product/addProduct", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast('Product added successfully!', 'success');
      setProduct({ name: '', description: '', price: '', quantity: '', categoryId: '', productimage: null });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error("Add product error:", err.response?.data);
      showToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filledCount = [product.name, product.price, product.quantity, product.categoryId].filter(Boolean).length;

  return (
    <>
      <style>{styles}</style>
      <div className="ap-root">
        <div className="ap-blob ap-blob-1" />
        <div className="ap-blob ap-blob-2" />
        <div className="ap-blob ap-blob-3" />

        <div className="ap-container">
          <div className="ap-accent-bar" />
          <div className="ap-card">

            {/* Header */}
            <div className="ap-header">
              <div className="ap-header-deco ap-header-deco-1" />
              <div className="ap-header-deco ap-header-deco-2" />
              <div className="ap-header-deco ap-header-deco-3" />
              <p className="ap-eyebrow">CraftNest</p>
              <h1 className="ap-title">Add New Product</h1>
              <p className="ap-subtitle">Fill in the details below to list a new product</p>
              <div className="ap-steps">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`ap-step-dot ${i < filledCount ? 'active' : ''}`} />
                ))}
              </div>
            </div>

            {/* Form */}
            <form className="ap-body" onSubmit={handleSubmit}>

              <p className="ap-section">Basic Info</p>

              <div className="ap-grid-2">
                <div className="ap-field">
                  <label className="ap-label"><IconTag /> Name <span className="ap-required">*</span></label>
                  <input className="ap-input" type="text" name="name"
                    placeholder="e.g. Handwoven Basket"
                    value={product.name} onChange={handleChange} />
                </div>
                <div className="ap-field">
                  <label className="ap-label"><IconBox /> Description</label>
                  <input className="ap-input" type="text" name="description"
                    placeholder="Brief product description"
                    value={product.description} onChange={handleChange} />
                </div>
              </div>

              <p className="ap-section">Pricing &amp; Stock</p>

              <div className="ap-grid-2">
                <div className="ap-field">
                  <label className="ap-label"><IconDollar /> Price <span className="ap-required">*</span></label>
                  <div className="ap-input-prefix">
                    <span className="ap-prefix-symbol">₹</span>
                    <input className="ap-input" type="number" name="price"
                      placeholder="0.00" min="0"
                      value={product.price} onChange={handleChange} />
                  </div>
                </div>
                <div className="ap-field">
                  <label className="ap-label"><IconPackage /> Quantity <span className="ap-required">*</span></label>
                  <input className="ap-input" type="number" name="quantity"
                    placeholder="Available stock" min="0"
                    value={product.quantity} onChange={handleChange} />
                </div>
              </div>

              <p className="ap-section">Category &amp; Media</p>

              <div className="ap-field">
                <label className="ap-label"><IconGrid /> Category <span className="ap-required">*</span></label>

                {catLoading && (
                  <div className="ap-cat-loading">
                    <div className="ap-mini-spinner" /> Loading categories...
                  </div>
                )}

                {!catLoading && catError && (
                  <div className="ap-cat-error">
                    <IconWarn /> {catError}
                    <button type="button" className="ap-cat-retry" onClick={fetchCategories}>
                      Retry
                    </button>
                  </div>
                )}

                {!catLoading && !catError && (
                  <select className="ap-select" name="categoryId"
                    value={product.categoryId} onChange={handleChange}>
                    <option value="">Select a category</option>
                    {category.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {getCatName(cat)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="ap-field">
                <label className="ap-label"><IconImage size={14} /> Product Image</label>
                <div className={`ap-file-zone ${product.productimage ? 'has-file' : ''}`}>
                  <input ref={fileInputRef} className="ap-file-input"
                    type="file" name="productimage" accept="image/*"
                    onChange={handleChange} />
                  <div className="ap-file-icon"><IconImage size={20} /></div>
                  {product.productimage ? (
                    <>
                      <p className="ap-file-text">Image selected</p>
                      <p className="ap-file-name">{product.productimage.name}</p>
                    </>
                  ) : (
                    <>
                      <p className="ap-file-text"><strong>Click to upload</strong> or drag &amp; drop</p>
                      <p className="ap-file-hint">PNG, JPG, WEBP up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="ap-divider" />

              <button className="ap-btn" type="submit" disabled={loading || catLoading}>
                {loading
                  ? <><div className="ap-spinner" /> Adding product...</>
                  : <><IconCheck /> Add Product</>
                }
              </button>

            </form>
          </div>
        </div>

        <div className={`ap-toast ${toast.type} ${toast.show ? 'show' : ''}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      </div>
    </>
  );
}
