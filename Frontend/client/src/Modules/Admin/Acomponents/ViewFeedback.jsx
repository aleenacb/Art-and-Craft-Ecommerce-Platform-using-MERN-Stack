import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 15 }) {
    return (
        <span style={{ fontSize: size, letterSpacing: 1 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ color: n <= rating ? '#D4714E' : '#eaddd6' }}>★</span>
            ))}
        </span>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div style={{ ...s.card, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 130, height: 12, borderRadius: 6, background: '#f0e8e2' }} />
                <div style={{ width: 80, height: 12, borderRadius: 6, background: '#f5efeb' }} />
            </div>
            <div style={{ width: '20%', height: 10, borderRadius: 6, background: '#f5efeb', marginBottom: 10 }} />
            <div style={{ width: '90%', height: 10, borderRadius: 6, background: '#f5efeb', marginBottom: 6 }} />
            <div style={{ width: '70%', height: 10, borderRadius: 6, background: '#f5efeb' }} />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ViewFeedback() {
    const navigate = useNavigate();

    const [reviews,    setReviews]    = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState('');
    const [search,     setSearch]     = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [toast,      setToast]      = useState({ msg: '', ok: false });
    const [deleting,   setDeleting]   = useState(null);

    // edit state
    const [editId,     setEditId]     = useState(null);
    const [editFields, setEditFields] = useState({ review: '', rating: 0, title: '', tags: '' });

    // ── Toast ──────────────────────────────────────────────────────────────────
    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast({ msg: '', ok: false }), 3000);
    };

    // ── Fetch all reviews ──────────────────────────────────────────────────────
    const fetchReviews = () => {
        setLoading(true);
        setError('');
        axios.get('http://localhost:7000/review/admin/all')
            .then(res => setReviews(res.data?.reviews || res.data || []))
            .catch(err => setError(err.response?.data?.message || 'Could not load reviews.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchReviews(); }, []);

    // ── Delete ─────────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this review?')) return;
        setDeleting(id);
        try {
            await axios.delete(`http://localhost:7000/review/admin/${id}`);
            setReviews(prev => prev.filter(r => r._id !== id));
            showToast('Review deleted.');
        } catch (err) {
            showToast(err.response?.data?.message || 'Delete failed.', false);
        } finally {
            setDeleting(null);
        }
    };

    // ── Edit ───────────────────────────────────────────────────────────────────
    const startEdit = (review) => {
        setEditId(review._id);
        setEditFields({
            review: review.review,
            rating: review.rating,
            title:  review.title  || '',
            tags:   (review.tags  || []).join(', '),
        });
    };

    const handleUpdate = async (id) => {
        if (!editFields.review.trim()) return showToast('Review text cannot be empty.', false);
        try {
            const payload = {
                review: editFields.review.trim(),
                rating: editFields.rating,
                title:  editFields.title.trim(),
                tags:   editFields.tags.split(',').map(t => t.trim()).filter(Boolean),
            };
            await axios.put(`http://localhost:7000/review/admin/${id}`, payload);
            setReviews(prev => prev.map(r => r._id === id ? { ...r, ...payload } : r));
            setEditId(null);
            showToast('Review updated!');
        } catch (err) {
            showToast(err.response?.data?.message || 'Update failed.', false);
        }
    };

    // ── Filtered list ──────────────────────────────────────────────────────────
    const filtered = reviews.filter(r => {
        const q = search.toLowerCase();
        const matchSearch = !q ||
            (r.userName  || '').toLowerCase().includes(q) ||
            (r.review    || '').toLowerCase().includes(q) ||
            (r.productId || '').toLowerCase().includes(q) ||
            (r.title     || '').toLowerCase().includes(q);
        const matchRating = !ratingFilter || r.rating === parseInt(ratingFilter);
        return matchSearch && matchRating;
    });

    // ── Metrics ────────────────────────────────────────────────────────────────
    const avgRating = filtered.length
        ? (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1)
        : null;
    const uniqueUsers = new Set(filtered.map(r => r.userId)).size;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div style={s.root}>
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />

            {/* Toast */}
            {toast.msg && (
                <div style={{ ...s.toast, background: toast.ok ? '#2d7a4f' : '#c0392b' }}>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <header style={s.header}>
                <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>
                <div style={s.logo}>● Artisan</div>
                <button onClick={fetchReviews} style={s.refreshBtn}>↻ Refresh</button>
            </header>

            <div style={s.page}>

                {/* Title */}
                <div style={s.titleBlock}>
                    <p style={s.eyebrow}>Admin Panel</p>
                    <div style={s.pageTitle}>
    All <em style={{ color: '#D4714E', fontStyle: 'italic' }}>Reviews</em>
</div>
                    <p style={s.subtitle}>Moderate, edit, and manage every community review</p>
                </div>

                {/* Metrics strip */}
                {!loading && !error && reviews.length > 0 && (
                    <div style={s.summaryStrip}>
                        <div style={s.summaryItem}>
                            <span style={s.summaryVal}>{filtered.length}</span>
                            <span style={s.summaryLbl}>Reviews</span>
                        </div>
                        <div style={s.summaryDivider} />
                        <div style={s.summaryItem}>
                            <span style={s.summaryVal}>{avgRating ?? '—'}</span>
                            <span style={s.summaryLbl}>Avg Rating</span>
                        </div>
                        <div style={s.summaryDivider} />
                        <div style={s.summaryItem}>
                            <span style={s.summaryVal}>{uniqueUsers}</span>
                            <span style={s.summaryLbl}>Unique Users</span>
                        </div>
                        <div style={s.summaryDivider} />
                        <div style={s.summaryItem}>
                            <Stars rating={Math.round(avgRating)} size={20} />
                            <span style={s.summaryLbl}>Avg Score</span>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div style={s.filters}>
                    <input
                        style={s.searchInput}
                        placeholder="🔍  Search by user, product, keyword…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        style={s.select}
                        value={ratingFilter}
                        onChange={e => setRatingFilter(e.target.value)}
                    >
                        <option value="">All ratings</option>
                        {[5, 4, 3, 2, 1].map(n => (
                            <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}  {n} star{n > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>

                {/* List */}
                <div style={s.listWrap}>

                    {loading && [1, 2, 3].map(i => <SkeletonCard key={i} />)}

                    {!loading && error && (
                        <div style={{ ...s.card, padding: 36, textAlign: 'center' }}>
                            <p style={{ color: '#D4714E', fontWeight: 600, marginBottom: 14 }}>⚠ {error}</p>
                            <button onClick={fetchReviews} style={s.ghostBtn}>↻ Retry</button>
                        </div>
                    )}

                    {!loading && !error && filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9b7b6a' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
                            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22 }}>No reviews found</p>
                        </div>
                    )}

                    {!loading && !error && filtered.map(review => {
                        const isEditing = editId === review._id;
                        const date = review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '';

                        return (
                            <div key={review._id} style={s.card}>

                                {/* Card header */}
                                <div style={s.cardHeader}>
                                    <div>
                                        {/* User info */}
                                        <p style={s.userName}>{review.userName || 'Anonymous'}</p>
                                        <p style={s.meta}>
                                            User ID: {review.userId?.toString().slice(-8).toUpperCase()}
                                            {review.productId && ` · Product: ${review.productId.toString().slice(-6).toUpperCase()}`}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={s.dateBadge}>{date}</div>
                                    </div>
                                </div>

                                {/* Rating row */}
                                {isEditing ? (
                                    <div style={{ display: 'flex', gap: 4, margin: '12px 0 4px' }}>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setEditFields(f => ({ ...f, rating: n }))}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: n <= editFields.rating ? '#D4714E' : '#eaddd6' }}
                                            >★</button>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ margin: '10px 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Stars rating={review.rating} />
                                        <span style={{ fontSize: 12, color: '#9b7b6a', fontWeight: 600 }}>{review.rating}/5</span>
                                    </div>
                                )}

                                {/* Title */}
                                {isEditing ? (
                                    <input
                                        style={{ ...s.input, marginBottom: 8 }}
                                        placeholder="Title (optional)"
                                        value={editFields.title}
                                        onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))}
                                    />
                                ) : (
                                    review.title && <p style={s.reviewTitle}>{review.title}</p>
                                )}

                                {/* Review body */}
                                {isEditing ? (
                                    <textarea
                                        style={{ ...s.input, resize: 'vertical', lineHeight: 1.6, marginBottom: 8 }}
                                        rows={4}
                                        maxLength={1000}
                                        value={editFields.review}
                                        onChange={e => setEditFields(f => ({ ...f, review: e.target.value }))}
                                    />
                                ) : (
                                    <p style={s.reviewBody}>{review.review}</p>
                                )}

                                {/* Tags */}
                                {isEditing ? (
                                    <input
                                        style={{ ...s.input, marginBottom: 12 }}
                                        placeholder="Tags — comma separated  e.g. quality, packaging"
                                        value={editFields.tags}
                                        onChange={e => setEditFields(f => ({ ...f, tags: e.target.value }))}
                                    />
                                ) : (
                                    review.tags?.length > 0 && (
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0 0' }}>
                                            {review.tags.map(tag => (
                                                <span key={tag} style={s.tag}>{tag}</span>
                                            ))}
                                        </div>
                                    )
                                )}

                                {/* Actions */}
                                <div style={s.cardActions}>
                                    {isEditing ? (
                                        <>
                                            <button onClick={() => handleUpdate(review._id)} style={{ ...s.primaryBtn, fontSize: 13, padding: '9px 24px' }}>
                                                ✓ Save
                                            </button>
                                            <button onClick={() => setEditId(null)} style={{ ...s.ghostBtn, fontSize: 13, padding: '9px 24px' }}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEdit(review)} style={s.actionBtn}>
                                                ✎ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                disabled={deleting === review._id}
                                                style={{ ...s.actionBtn, color: '#c0392b', opacity: deleting === review._id ? 0.5 : 1 }}
                                            >
                                                {deleting === review._id ? 'Deleting…' : '✕ Delete'}
                                            </button>
                                        </>
                                    )}
                                </div>

                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
    root:        { minHeight: '100vh', background: '#f8f4f0', fontFamily: "'Jost', sans-serif" },
    toast:       { position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
                   color: '#fff', fontSize: 13, fontWeight: 500, padding: '11px 28px',
                   borderRadius: 50, zIndex: 9999, whiteSpace: 'nowrap' },
    header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   padding: '0 40px', height: 68, background: 'rgba(248,244,240,0.95)',
                   borderBottom: '1px solid rgba(212,113,78,0.1)', position: 'sticky', top: 0, zIndex: 100 },
    backBtn:     { background: 'none', border: '1.5px solid #eaddd6', borderRadius: 50,
                   padding: '8px 20px', fontSize: 13, color: '#7a5a4f', cursor: 'pointer',
                   fontFamily: "'Jost', sans-serif" },
    logo:        { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#2d1f17' },
    refreshBtn:  { padding: '8px 20px', background: 'none', color: '#7a5a4f',
                   border: '1.5px solid #eaddd6', borderRadius: 50, fontSize: 13, fontWeight: 600,
                   fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
    page:        { maxWidth: 720, margin: '0 auto', padding: '48px 20px 80px' },
    titleBlock:  { marginBottom: 32 },
    eyebrow:     { fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase',
                   color: '#D4714E', margin: '0 0 10px 0' },
    pageTitle:   { fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 600,
                   color: '#2d1f17', margin: '8px 0 6px', lineHeight: 1.1 },
    subtitle:    { fontSize: 14, color: '#9b7b6a', margin: 0 },

    summaryStrip:  { display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                     background: '#fff', border: '1px solid #eaddd6', borderRadius: 16,
                     padding: '20px 0', marginBottom: 24 },
    summaryItem:   { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
    summaryVal:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: '#2d1f17' },
    summaryLbl:    { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9b7b6a', fontWeight: 600 },
    summaryDivider:{ width: 1, height: 40, background: '#eaddd6' },

    filters:     { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
    searchInput: { flex: 1, minWidth: 200, padding: '10px 16px', border: '1.5px solid #eaddd6',
                   borderRadius: 50, fontSize: 13, fontFamily: "'Jost', sans-serif",
                   color: '#2d1f17', background: '#fff', outline: 'none' },
    select:      { padding: '10px 16px', border: '1.5px solid #eaddd6', borderRadius: 50,
                   fontSize: 13, fontFamily: "'Jost', sans-serif", color: '#7a5a4f',
                   background: '#fff', cursor: 'pointer', outline: 'none' },

    listWrap:    { display: 'flex', flexDirection: 'column', gap: 12 },
    card:        { background: '#fff', borderRadius: 18, border: '1px solid #eaddd6', padding: '22px 24px' },
    cardHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
    userName:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: '#2d1f17', margin: 0 },
    meta:        { fontSize: 11, color: '#c9aa9e', marginTop: 3, letterSpacing: 0.4 },
    reviewTitle: { fontSize: 15, fontWeight: 600, color: '#2d1f17', margin: '8px 0 0' },
    reviewBody:  { fontSize: 14, color: '#5a4038', lineHeight: 1.7, margin: '10px 0 0' },
    dateBadge:   { fontSize: 11, color: '#9b7b6a', background: '#f8f4f0', padding: '3px 10px',
                   borderRadius: 50, fontWeight: 500 },
    tag:         { fontSize: 11, color: '#D4714E', background: '#fff8f5', border: '1px solid #f2dace',
                   padding: '3px 10px', borderRadius: 50, fontWeight: 500 },
    cardActions: { display: 'flex', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid #f5ede8' },
    actionBtn:   { background: 'none', border: '1.5px solid #eaddd6', borderRadius: 50,
                   padding: '7px 18px', fontSize: 12, fontWeight: 600, color: '#7a5a4f',
                   cursor: 'pointer', fontFamily: "'Jost', sans-serif" },
    input:       { padding: '11px 16px', border: '1.5px solid #eaddd6', borderRadius: 12,
                   fontSize: 14, fontFamily: "'Jost', sans-serif", color: '#2d1f17',
                   background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' },
    primaryBtn:  { padding: '12px 28px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
                   color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
                   fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
    ghostBtn:    { padding: '12px 28px', background: '#fff', color: '#7a5a4f',
                   border: '1.5px solid #eaddd6', borderRadius: 50, fontSize: 14, fontWeight: 600,
                   fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
};
