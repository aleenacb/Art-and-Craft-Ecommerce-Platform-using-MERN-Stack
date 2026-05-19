import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fc-root {
    min-height: 100vh;
    background: #f8f4f0;
    font-family: 'Jost', sans-serif;
  }

  /* ── Hero ── */
  .fc-hero {
    padding: 64px 48px 40px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .fc-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    color: #D4714E;
    margin-bottom: 12px;
  }

  .fc-eyebrow::before {
    content: '';
    width: 24px;
    height: 1.5px;
    background: #D4714E;
    display: inline-block;
  }

  .fc-headline {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(40px, 5vw, 64px);
    font-weight: 600;
    color: #2d1f17;
    line-height: 1.05;
    letter-spacing: -1px;
  }

  .fc-headline em {
    font-style: italic;
    color: #D4714E;
  }

  .fc-sub {
    font-size: 14px;
    font-weight: 300;
    color: #9b7b6a;
    margin-top: 10px;
    letter-spacing: 0.3px;
  }

  /* ── Filter bar ── */
  .fc-filter-wrap {
    padding: 0 48px 36px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .fc-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .fc-filter-label {
    font-size: 12px;
    font-weight: 500;
    color: #9b7b6a;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-right: 4px;
  }

  .fc-pill {
    padding: 8px 20px;
    border-radius: 50px;
    border: 1.5px solid #e8d9d0;
    background: transparent;
    color: #7a5a4f;
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .fc-pill:hover {
    border-color: #D4714E;
    color: #D4714E;
    background: rgba(212,113,78,0.05);
  }

  .fc-pill.active {
    background: #D4714E;
    border-color: #D4714E;
    color: #fff;
  }

  /* ── Grid ── */
  .fc-grid-wrap {
    padding: 0 48px 80px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .fc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 28px;
  }

  /* ── Card ── */
  .fc-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #eee5df;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.28s ease;
    position: relative;
  }

  .fc-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(180, 100, 60, 0.14);
  }

  /* Image area */
  .fc-img-wrap {
    position: relative;
    width: 100%;
    padding-top: 72%;
    background: #fdf0e8;
    overflow: hidden;
  }

  .fc-img-wrap img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .fc-card:hover .fc-img-wrap img {
    transform: scale(1.06);
  }

  .fc-img-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: #d4b4a0;
  }

  /* Stock badge */
  .fc-badge {
    position: absolute;
    top: 14px;
    left: 14px;
    padding: 5px 12px;
    border-radius: 50px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    z-index: 2;
  }

  .fc-badge.in-stock  { background: #2e7d4f; color: #fff; }
  .fc-badge.low-stock { background: #c07820; color: #fff; }
  .fc-badge.out       { background: #e05555; color: #fff; }

  /* Wishlist btn */
  .fc-wish {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    z-index: 2;
    transition: transform 0.2s;
    backdrop-filter: blur(4px);
  }

  .fc-wish:hover { transform: scale(1.15); }

  /* Card body */
  .fc-body {
    padding: 20px 22px 22px;
  }

  .fc-cat {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #D4714E;
    margin-bottom: 6px;
    display: block;
  }

  .fc-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 600;
    color: #2d1f17;
    line-height: 1.2;
    margin-bottom: 6px;
  }

  .fc-origin {
    font-size: 12px;
    font-weight: 300;
    color: #b09080;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .fc-origin::before {
    content: '◎';
    font-size: 9px;
    color: #D4714E;
  }

  .fc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .fc-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 600;
    color: #2d1f17;
  }

  .fc-price span {
    font-size: 14px;
    font-weight: 400;
    color: #9b7b6a;
    margin-right: 2px;
  }

  .fc-view-btn {
    padding: 8px 18px;
    border-radius: 50px;
    background: linear-gradient(135deg, #D4714E, #b85535);
    color: #fff;
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.18s;
    letter-spacing: 0.5px;
  }

  .fc-view-btn:hover {
    opacity: 0.88;
    transform: scale(1.04);
  }

  /* Empty */
  .fc-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    color: #9b7b6a;
  }

  .fc-empty-icon {
    font-size: 52px;
    display: block;
    margin-bottom: 16px;
  }

  .fc-empty h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    color: #2d1f17;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .fc-empty p {
    font-size: 14px;
    font-weight: 300;
  }

  /* Loading skeletons */
  .fc-skeleton {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #eee5df;
    overflow: hidden;
    animation: fc-pulse 1.6s ease-in-out infinite;
  }

  @keyframes fc-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }

  .fc-skel-img { width: 100%; padding-top: 72%; background: #f2e8e2; }
  .fc-skel-body { padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 10px; }
  .fc-skel-line { height: 12px; border-radius: 6px; background: #f2e8e2; }
  .fc-skel-line.wide { width: 70%; }
  .fc-skel-line.full { width: 100%; }
  .fc-skel-line.short { width: 40%; }

  /* Search */
  .fc-search-wrap {
    padding: 0 48px 20px;
    max-width: 1280px;
    margin: 0 auto;
  }

  .fc-search {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1.5px solid #eee5df;
    border-radius: 50px;
    padding: 10px 20px;
    max-width: 380px;
    transition: border-color 0.2s;
  }

  .fc-search:focus-within {
    border-color: #D4714E;
  }

  .fc-search-icon {
    color: #b09080;
    font-size: 14px;
    flex-shrink: 0;
  }

  .fc-search input {
    border: none;
    outline: none;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    color: #2d1f17;
    background: transparent;
    width: 100%;
  }

  .fc-search input::placeholder {
    color: #c4a898;
    font-weight: 300;
  }

  @media (max-width: 640px) {
    .fc-hero, .fc-filter-wrap, .fc-grid-wrap, .fc-search-wrap { padding-left: 20px; padding-right: 20px; }
    .fc-grid { grid-template-columns: 1fr 1fr; gap: 14px; }
    .fc-headline { font-size: 36px; }
  }

  @media (max-width: 420px) {
    .fc-grid { grid-template-columns: 1fr; }
  }
`;

export default function FilterCategory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [wished, setWished] = useState({});

  useEffect(() => {
    axios.get('http://localhost:7000/product/getProducts')
      .then(res => {
        const data = res.data.pdata || [];
        setProducts(data);
        // Extract unique categories
        const cats = [...new Set(
          data.map(p =>
            typeof p.categoryId === 'object'
              ? p.categoryId?.categoryName
              : p.categoryId
          ).filter(Boolean)
        )];
        setCategories(cats);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleWish = (e, id) => {
    e.stopPropagation();
    setWished(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = products.filter(p => {
    const cat = typeof p.categoryId === 'object'
      ? p.categoryId?.categoryName
      : p.categoryId;
    const matchCat = activeFilter === 'All' || cat === activeFilter;
    const matchSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getBadge = (qty) => {
    const q = Number(qty);
    if (q <= 0) return { label: 'Out of Stock', cls: 'out' };
    if (q <= 5) return { label: `Only ${q} left`, cls: 'low-stock' };
    return { label: 'In Stock', cls: 'in-stock' };
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fc-root">

        {/* Hero */}
        <div className="fc-hero">
          <p className="fc-eyebrow">Our Collection</p>
          <h1 className="fc-headline">
            Handcrafted with <em>love</em>
          </h1>
          <p className="fc-sub">
            Discover {products.length} unique artisan products
          </p>
        </div>

        {/* Search */}
        <div className="fc-search-wrap">
          <div className="fc-search">
            <span className="fc-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="fc-filter-wrap">
          <div className="fc-filters">
            <span className="fc-filter-label">Filter:</span>
            <button
              className={`fc-pill ${activeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setActiveFilter('All')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`fc-pill ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="fc-grid-wrap">
          <div className="fc-grid">

            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="fc-skeleton">
                  <div className="fc-skel-img" />
                  <div className="fc-skel-body">
                    <div className="fc-skel-line short" />
                    <div className="fc-skel-line wide" />
                    <div className="fc-skel-line full" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="fc-empty">
                <span className="fc-empty-icon">🎨</span>
                <h3>No products found</h3>
                <p>Try a different filter or search term.</p>
              </div>
            ) : (
              filtered.map(product => {
                const catName = typeof product.categoryId === 'object'
                  ? product.categoryId?.categoryName
                  : product.categoryId;
                const badge = getBadge(product.quantity);
                const imgSrc = product.productimage
                  ? `http://localhost:7000/uploads/${product.productimage}`
                  : null;

                return (
                  <div
                    key={product._id}
                    className="fc-card"
                    onClick={() => navigate(`/Users/ViewProductDetail/${product._id}`)}
                  >
                    {/* Image */}
                    <div className="fc-img-wrap">
                      {imgSrc
                        ? <img src={imgSrc} alt={product.name} />
                        : <div className="fc-img-placeholder">🖼️</div>
                      }
                      <span className={`fc-badge ${badge.cls}`}>{badge.label}</span>
                      <button
                        className="fc-wish"
                        onClick={e => toggleWish(e, product._id)}
                        title="Wishlist"
                      >
                        {wished[product._id] ? '❤️' : '🤍'}
                      </button>
                    </div>

                    {/* Body */}
                    <div className="fc-body">
                      {catName && <span className="fc-cat">{catName}</span>}
                      <h2 className="fc-name">{product.name}</h2>
                      {product.origin && (
                        <span className="fc-origin">{product.origin}</span>
                      )}
                      <div className="fc-footer">
                        <div className="fc-price">
                          <span>₹</span>
                          {Number(product.price).toLocaleString('en-IN')}
                        </div>
                        <button className="fc-view-btn">View Details</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </>
  );
}
