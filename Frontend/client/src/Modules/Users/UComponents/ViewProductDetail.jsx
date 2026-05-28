import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pl-root {
    min-height: 100vh;
    background: #fdf6f0;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .pl-blob {
    position: fixed; border-radius: 50%; pointer-events: none;
    filter: blur(100px); opacity: 0.22; z-index: 0;
  }
  .pl-blob-1 { width: 600px; height: 600px; top: -200px; right: -150px; background: #f5c9b3; }
  .pl-blob-2 { width: 400px; height: 400px; bottom: 0; left: -150px; background: #e8d8c8; }

  /* ── Header ── */
  .pl-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(253,246,240,0.9);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(212,113,78,0.1);
    padding: 0 40px; height: 68px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .pl-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 600; color: #2d1f17;
    display: flex; align-items: center; gap: 8px;
  }
  .pl-logo-dot { width: 8px; height: 8px; background: #D4714E; border-radius: 50%; }

  .pl-header-right { display: flex; align-items: center; gap: 12px; }

  .pl-search-wrap {
    position: relative; display: flex; align-items: center;
  }
  .pl-search-icon {
    position: absolute; left: 14px; color: #c8a090; pointer-events: none;
  }
  .pl-search {
    padding: 9px 16px 9px 40px;
    border: 1.5px solid #eaddd6; border-radius: 50px;
    background: #fff; font-size: 13px; font-family: 'Jost', sans-serif;
    color: #2d1f17; width: 220px; outline: none;
    transition: border-color 0.18s, width 0.3s;
  }
  .pl-search::placeholder { color: #c8a090; }
  .pl-search:focus { border-color: #D4714E; width: 260px; }

  .pl-cart-btn {
    position: relative; width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    background: #fff; border: 1.5px solid #eaddd6; border-radius: 50%;
    cursor: pointer; color: #7a5a4f; transition: all 0.18s;
  }
  .pl-cart-btn:hover { border-color: #D4714E; color: #D4714E; }
  .pl-cart-count {
    position: absolute; top: -4px; right: -4px;
    background: #D4714E; color: #fff;
    font-size: 10px; font-weight: 600;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fdf6f0;
  }

  /* ── Body ── */
  .pl-body {
    position: relative; z-index: 1;
    padding: 40px 40px 80px;
    max-width: 1200px; margin: 0 auto;
  }

  .pl-hero {
    margin-bottom: 40px;
    animation: pl-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes pl-rise {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pl-hero-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: 3.5px;
    text-transform: uppercase; color: #D4714E;
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .pl-hero-eyebrow::before { content: ''; width: 20px; height: 1.5px; background: #D4714E; }

  .pl-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 54px; font-weight: 600; color: #2d1f17;
    line-height: 1.05; letter-spacing: -0.5px;
  }
  .pl-hero-title em { color: #D4714E; font-style: italic; }

  .pl-hero-sub {
    margin-top: 12px; font-size: 15px; color: #9b7b6a; font-weight: 300;
  }

  /* ── Filter bar ── */
  .pl-filter-bar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 32px; flex-wrap: wrap;
  }
  .pl-filter-label { font-size: 13px; color: #9b7b6a; font-weight: 500; margin-right: 4px; }
  .pl-filter-chip {
    padding: 7px 18px; border-radius: 50px;
    border: 1.5px solid #eaddd6; background: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Jost', sans-serif;
    color: #7a5a4f; cursor: pointer; transition: all 0.18s;
  }
  .pl-filter-chip:hover { border-color: #D4714E; color: #D4714E; }
  .pl-filter-chip.active {
    background: #D4714E; border-color: #D4714E; color: #fff;
  }

  /* ── Grid ── */
  .pl-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  /* ── Card ── */
  .pl-card {
    background: #fff;
    border: 1px solid #eaddd6;
    border-radius: 24px; overflow: hidden;
    display: flex; flex-direction: column;
    transition: box-shadow 0.22s, transform 0.22s;
    animation: pl-card-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
    cursor: pointer;
  }
  .pl-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 48px rgba(180,100,60,0.14), 0 4px 16px rgba(180,100,60,0.07);
  }
  @keyframes pl-card-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Image area */
  .pl-card-img-wrap {
    position: relative;
    aspect-ratio: 4 / 3;
    background: linear-gradient(145deg, #fdf0e8, #f4ddd0);
    overflow: hidden;
  }
  .pl-card-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
  }
  .pl-card:hover .pl-card-img { transform: scale(1.07); }

  .pl-card-img-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    color: #D4714E; opacity: 0.35;
  }

  .pl-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(45,31,23,0.28) 0%, transparent 50%);
    pointer-events: none;
  }

  .pl-card-stock {
    position: absolute; top: 12px; left: 12px;
    padding: 4px 12px; border-radius: 50px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.8px;
    text-transform: uppercase; backdrop-filter: blur(6px);
  }
  .pl-card-stock.in  { background: rgba(15,110,86,0.82);  color: #c8ffe8; }
  .pl-card-stock.low { background: rgba(186,117,23,0.82); color: #fff3d0; }
  .pl-card-stock.out { background: rgba(163,45,45,0.82);  color: #ffd0d0; }

  /* Like button on image */
  .pl-card-like-btn {
    position: absolute; top: 12px; right: 12px;
    width: 34px; height: 34px; border-radius: 50%;
    background: rgba(255,255,255,0.88); backdrop-filter: blur(6px);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #c8a090; transition: all 0.18s;
    z-index: 2;
  }
  .pl-card-like-btn:hover { background: #fff; color: #e85d7a; transform: scale(1.12); }
  .pl-card-like-btn.liked { background: #fff0f3; color: #e85d7a; }

  /* Card body */
  .pl-card-body { padding: 18px 18px 6px; display: flex; flex-direction: column; gap: 6px; }

  .pl-card-cat { font-size: 10px; font-weight: 600; letter-spacing: 2.5px; text-transform: uppercase; color: #D4714E; }

  .pl-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 600; color: #2d1f17;
    line-height: 1.2; overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }

  .pl-card-desc {
    font-size: 13px; color: #9b7b6a; font-weight: 300; line-height: 1.6;
    overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }

  .pl-card-price-row {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 8px;
  }
  .pl-card-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px; font-weight: 600; color: #D4714E;
  }
  .pl-card-price-sym { font-size: 14px; vertical-align: super; opacity: 0.8; }

  .pl-card-stars { display: flex; gap: 2px; }
  .pl-card-star { font-size: 12px; }

  /* Card actions */
  .pl-card-actions {
    padding: 10px 18px 16px;
    display: flex; gap: 8px;
  }

  .pl-card-btn-book {
    flex: 1.2; padding: 10px 0;
    background: linear-gradient(135deg, #D4714E, #b85535);
    color: #fff; border: none; border-radius: 50px;
    font-size: 13px; font-weight: 600; font-family: 'Jost', sans-serif;
    cursor: pointer; letter-spacing: 0.3px;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    box-shadow: 0 6px 18px rgba(212,113,78,0.35);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .pl-card-btn-book:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(212,113,78,0.45); }
  .pl-card-btn-book:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

  .pl-card-btn-cart {
    flex: 1; padding: 10px 0;
    background: #fff; color: #D4714E;
    border: 1.5px solid #D4714E; border-radius: 50px;
    font-size: 13px; font-weight: 600; font-family: 'Jost', sans-serif;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.15s;
  }
  .pl-card-btn-cart:hover:not(:disabled) { background: #D4714E; color: #fff; }
  .pl-card-btn-cart:disabled { opacity: 0.4; cursor: not-allowed; }

  .pl-card-btn-share {
    width: 38px; height: 38px; flex-shrink: 0;
    border-radius: 50%; border: 1.5px solid #eaddd6;
    background: #fdf6f0; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #9b7b6a; transition: all 0.15s;
  }
  .pl-card-btn-share:hover { border-color: #D4714E; color: #D4714E; background: #fff; }

  /* ── Empty / Error ── */
  .pl-center {
    grid-column: 1 / -1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 20px; gap: 16px; text-align: center;
  }
  .pl-spinner {
    width: 44px; height: 44px;
    border: 3px solid #eaddd6; border-top-color: #D4714E;
    border-radius: 50%; animation: pl-spin 0.8s linear infinite;
  }
  @keyframes pl-spin { to { transform: rotate(360deg); } }
  .pl-center-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: #2d1f17; }
  .pl-center-sub { font-size: 14px; color: #9b7b6a; font-weight: 300; }

  /* ── Toast ── */
  .pl-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%);
    background: #2d1f17; color: #fff;
    font-size: 13px; font-weight: 500; font-family: 'Jost', sans-serif;
    padding: 11px 24px; border-radius: 50px;
    box-shadow: 0 8px 28px rgba(0,0,0,0.22);
    z-index: 9999; pointer-events: none;
    animation: pl-toast-in 0.3s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes pl-toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(14px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  @media (max-width: 768px) {
    .pl-header { padding: 0 20px; }
    .pl-body { padding: 24px 20px 60px; }
    .pl-hero-title { font-size: 38px; }
    .pl-search { width: 160px; }
    .pl-search:focus { width: 190px; }
  }
`;

/* ─── Icons ─── */
const Ic = {
  Cart: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Book: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Heart: ({ filled }) => <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? '#e85d7a' : 'none'} stroke={filled ? '#e85d7a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Share: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Search: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  CartHead: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Image: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
};

/* ─── Helpers ─── */
function getStockStatus(qty) {
  const n = Number(qty);
  if (n <= 0)  return { label: 'Out of Stock', cls: 'out' };
  if (n <= 5)  return { label: `Only ${n} left`, cls: 'low' };
  return { label: 'In Stock', cls: 'in' };
}
function formatPrice(v) {
  return Number(v).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
}
function getCategoryName(p) {
  if (!p?.categoryId) return null;
  if (typeof p.categoryId === 'object') return p.categoryId.categoryName || p.categoryId.name || null;
  return null;
}
function getImgSrc(p) {
  const raw = p?.productimage || p?.image || p?.imageUrl || '';
  if (!raw) return null;
  if (raw.startsWith('http')) return raw;
  return `http://localhost:7000/uploads/${raw}`;
}
function extractProducts(data) {
  // Log raw response so you can see the shape in DevTools console
  console.log('📦 Raw API response:', data);

  // Try every common wrapper key
  const candidates = [
    data?.products,
    data?.pdata,
    data?.data?.products,
    data?.data,
    data?.result,
    data?.items,
    data?.productList,
    data?.allProducts,
    data,
  ];

  const found = candidates.find(c => Array.isArray(c) && c.length >= 0);
  console.log('✅ Extracted products array:', found);
  return found || [];
}

export default function ViewProductDetail() {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [search, setSearch]     = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [liked, setLiked]       = useState({});  // { _id: bool }
  const [toast, setToast]       = useState('');
  const [cartCount, setCartCount] = useState(0);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2600); };

  // Sync cart count from localStorage
  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum, i) => sum + (i.cartQty || 1), 0));
    };
    update();
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    console.log('Fetching: http://localhost:7000/product/getProducts');
    axios.get('http://localhost:7000/product/getProducts', { timeout: 8000 })
      .then(res => {
        console.log('API response:', res.data);
        const list = extractProducts(res.data);
        console.log('Extracted', list.length, 'products');
        setProducts(list);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        if (!err.response) {
          setError('Cannot reach server at localhost:7000. Is your backend running?');
        } else if (err.response.status === 404) {
          setError('Endpoint not found (404) — check your backend route is /product/getProducts');
        } else {
          setError(err.response?.data?.message || 'Server error ' + err.response?.status);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleLike = useCallback((e, id, name) => {
    e.stopPropagation();
    setLiked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(next[id] ? `❤️  "${name}" wishlisted` : `Removed "${name}" from wishlist`);
      return next;
    });
  }, []);

  const handleShare = useCallback((e, p) => {
    e.stopPropagation();
    const url = `${window.location.origin}/Users/ViewProductDetail/${p._id}`;
    if (navigator.share) {
      navigator.share({ title: p.name, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => showToast('🔗  Link copied'));
    }
  }, []);

  const handleAddToCart = useCallback(async (e, p) => {
  e.stopPropagation();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  try {
    await axios.post('http://localhost:7000/cart/AddToCart', {
      userId,
      productId: p._id,
      name:      p.name,
      price:     p.price,
      image:     p.productimage || p.image || '',
      category:  getCategoryName(p) || '',
      quantity:  1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Update cart count in header
    setCartCount(prev => prev + 1);
    showToast(`✓  "${p.name}" added to cart`);
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to add to cart';
    showToast(`✗  ${msg}`);
  }
}, []);

  const handleBookNow = useCallback((e, p) => {
    e.stopPropagation();
    navigate('/Users/Booking', {
      state: { productId: p._id, productName: p.name, price: p.price, quantity: 1 }
    });
  }, [navigate]);

  /* derive unique categories */
  const categories = ['All', ...new Set(products.map(p => getCategoryName(p)).filter(Boolean))];

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                        p.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'All' || getCategoryName(p) === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="pl-root">
        <div className="pl-blob pl-blob-1" /><div className="pl-blob pl-blob-2" />
        {toast && <div className="pl-toast">{toast}</div>}

        {/* Header */}
        <header className="pl-header">
          <div className="pl-logo">
            <div className="pl-logo-dot" />
            Artisan
          </div>
          <div className="pl-header-right">
            <div className="pl-search-wrap">
              <span className="pl-search-icon"><Ic.Search /></span>
              <input
                className="pl-search"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="pl-cart-btn" onClick={() => navigate('/Users/Cart')}>
              <Ic.CartHead />
              {cartCount > 0 && <span className="pl-cart-count">{cartCount}</span>}
            </button>
          </div>
        </header>

        <main className="pl-body">
          {/* Hero */}
          <div className="pl-hero">
            <p className="pl-hero-eyebrow">Our collection</p>
            <h1 className="pl-hero-title">Handcrafted with <em>love</em></h1>
            <p className="pl-hero-sub">Discover {products.length} unique artisan products</p>
          </div>

          {/* Filter chips */}
          {categories.length > 1 && (
            <div className="pl-filter-bar">
              <span className="pl-filter-label">Filter:</span>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`pl-filter-chip${activeFilter === cat ? ' active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="pl-grid">
            {loading && (
              <div className="pl-center">
                <div className="pl-spinner" />
                <span style={{ fontSize: 14, color: '#9b7b6a' }}>Loading products…</span>
              </div>
            )}

            {!loading && error && (
              <div className="pl-center">
                <span style={{ fontSize: 48 }}>🚫</span>
                <p className="pl-center-title">Couldn't load products</p>
                <p className="pl-center-sub" style={{ color: '#c05535', fontWeight: 500 }}>{error}</p>
                <p className="pl-center-sub" style={{ marginTop: 8 }}>Open browser DevTools → Console for details</p>
                <button
                  onClick={() => window.location.reload()}
                  style={{ marginTop: 16, padding: '10px 24px', borderRadius: 50, border: '1.5px solid #D4714E',
                    background: '#fff', color: '#D4714E', fontFamily: 'Jost, sans-serif',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="pl-center">
                <span style={{ fontSize: 48 }}>🔍</span>
                <p className="pl-center-title">No products found</p>
                <p className="pl-center-sub">Try a different search or filter</p>
              </div>
            )}

            {!loading && !error && filtered.map((p, idx) => {
              const stock  = getStockStatus(p.quantity);
              const imgSrc = getImgSrc(p);
              const cat    = getCategoryName(p);
              const isLiked = !!liked[p._id];
              const outOfStock = Number(p.quantity) <= 0;

              return (
                <div
                  key={p._id || idx}
                  className="pl-card"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  onClick={() => {
  console.log('Navigating to id:', p._id); // ✅ check this in console
  navigate(`/Users/ViewProductDetail/${p._id}`);
}}
                >
                  {/* Image */}
                  <div className="pl-card-img-wrap">
                    {imgSrc
                      ? <img className="pl-card-img" src={imgSrc} alt={p.name}
                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      : null}
                    <div className="pl-card-img-placeholder" style={{ display: imgSrc ? 'none' : 'flex' }}>
                      <Ic.Image />
                    </div>
                    <div className="pl-card-img-overlay" />
                    <span className={`pl-card-stock ${stock.cls}`}>{stock.label}</span>
                    <button
                      className={`pl-card-like-btn${isLiked ? ' liked' : ''}`}
                      onClick={e => toggleLike(e, p._id, p.name)}
                      title={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Ic.Heart filled={isLiked} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="pl-card-body">
                    {cat && <span className="pl-card-cat">{cat}</span>}
                    <h2 className="pl-card-name">{p.name}</h2>
                    {p.description && <p className="pl-card-desc">{p.description}</p>}

                    <div className="pl-card-price-row">
                      <span className="pl-card-price">
                        <span className="pl-card-price-sym">₹</span>
                        {formatPrice(p.price)}
                      </span>
                      <div className="pl-card-stars">
                        {[1,2,3,4,5].map(s => (
                          <span key={s} className="pl-card-star" style={{ color: s <= 4 ? '#D4714E' : '#e8d5c4' }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pl-card-actions">
                    <button
                      className="pl-card-btn-book"
                      disabled={outOfStock}
                      onClick={e => handleBookNow(e, p)}
                    >
                      <Ic.Book />
                      {outOfStock ? 'Sold Out' : 'Book Now'}
                    </button>
                    <button
                      className="pl-card-btn-cart"
                      disabled={outOfStock}
                      onClick={e => handleAddToCart(e, p)}
                    >
                      <Ic.Cart />
                      Cart
                    </button>
                    <button
                      className="pl-card-btn-share"
                      onClick={e => handleShare(e, p)}
                      title="Share"
                    >
                      <Ic.Share />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
