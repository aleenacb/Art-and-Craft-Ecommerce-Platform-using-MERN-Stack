<<<<<<< HEAD
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Stars({ rating, size = 16 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{ color: n <= rating ? '#D4714E' : '#eaddd6' }}>★</span>
      ))}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...s.card, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 120, height: 12, borderRadius: 6, background: '#f0e8e2' }} />
        <div style={{ width: 80,  height: 12, borderRadius: 6, background: '#f5efeb' }} />
      </div>
      <div style={{ width: '60%', height: 10, borderRadius: 6, background: '#f5efeb', marginBottom: 10 }} />
      <div style={{ width: '90%', height: 10, borderRadius: 6, background: '#f5efeb', marginBottom: 6  }} />
      <div style={{ width: '75%', height: 10, borderRadius: 6, background: '#f5efeb' }} />
    </div>
  );
}

function EmptyState({ navigate }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 40px' }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>✦</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: '#2d1f17', marginBottom: 8 }}>
        No reviews yet
      </h3>
      <p style={{ color: '#9b7b6a', fontSize: 14, marginBottom: 28 }}>
        Share your experience with an Artisan product you've purchased.
      </p>
      <button onClick={() => navigate('/Users/WriteReview')} style={s.primaryBtn}>
        Write Your First Review →
      </button>
    </div>
  );
}

export default function MyReviews() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem('userId');

  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [deleting,  setDeleting]  = useState(null);
  const [editId,    setEditId]    = useState(null);
  const [editText,  setEditText]  = useState('');
  const [editRating,setEditRating]= useState(0);
  const [toast,     setToast]     = useState({ msg: '', ok: false });

  const showToast = (msg, ok = false) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: false }), 3000);
  };

  const fetchReviews = () => {
    if (!userId) { setError('Please log in to view your reviews.'); setLoading(false); return; }
    setLoading(true);
    axios.get(`http://localhost:7000/review/user/${userId}`)
      .then(res => setReviews(res.data?.reviews || res.data || []))
      .catch(err => setError(err.response?.data?.message || 'Could not load reviews.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [userId]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    setDeleting(reviewId);
    try {
      await axios.delete(`http://localhost:7000/review/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      showToast('Review deleted.', true);
    } catch (err) {
      showToast('Could not delete: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(null);
    }
  };

  const startEdit = (review) => {
    setEditId(review._id);
    setEditText(review.review);
    setEditRating(review.rating);
  };

  const handleUpdate = async (reviewId) => {
    if (!editText.trim()) return showToast('Review text cannot be empty.');
    try {
      await axios.put(`http://localhost:7000/review/${reviewId}`, {
        review: editText.trim(),
        rating: editRating,
      });
      setReviews(prev => prev.map(r =>
        r._id === reviewId ? { ...r, review: editText.trim(), rating: editRating } : r
      ));
      setEditId(null);
      showToast('Review updated!', true);
    } catch (err) {
      showToast('Could not update: ' + (err.response?.data?.message || err.message));
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div style={s.root}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {toast.msg && (
        <div style={{ ...s.toast, background: toast.ok ? '#2d7a4f' : '#2d1f17' }}>
          {toast.msg}
        </div>
      )}

      <header style={s.header}>
        <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>
        <div style={s.logo}>● Artisan</div>
        <button onClick={() => navigate('/Users/WriteReview')} style={s.writeBtn}>
          + Write Review
        </button>
      </header>

      <div style={s.page}>

        <div style={s.titleBlock}>
          <p style={s.eyebrow}>Your Account</p>
          <h1 style={s.pageTitle}>My <em style={{ color: '#D4714E', fontStyle: 'italic' }}>Reviews</em></h1>
          <p style={s.subtitle}>Everything you've shared with the Artisan community</p>
        </div>

        {/* Summary strip */}
        {!loading && !error && reviews.length > 0 && (
          <div style={s.summaryStrip}>
            <div style={s.summaryItem}>
              <span style={s.summaryVal}>{reviews.length}</span>
              <span style={s.summaryLbl}>Reviews Written</span>
            </div>
            <div style={s.summaryDivider} />
            <div style={s.summaryItem}>
              <span style={s.summaryVal}>{avgRating}</span>
              <span style={s.summaryLbl}>Avg Rating</span>
            </div>
            <div style={s.summaryDivider} />
            <div style={s.summaryItem}>
              <Stars rating={Math.round(avgRating)} size={20} />
              <span style={s.summaryLbl}>Your Score</span>
            </div>
          </div>
        )}

        <div style={s.listWrap}>
          {loading && [1, 2, 3].map(i => <SkeletonCard key={i} />)}

          {!loading && error && (
            <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#D4714E', fontWeight: 600 }}>⚠ {error}</p>
            </div>
          )}

          {!loading && !error && reviews.length === 0 && (
            <EmptyState navigate={navigate} />
          )}

          {!loading && !error && reviews.map(review => {
            const isEditing = editId === review._id;
            const date = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : '';

            return (
              <div key={review._id} style={s.card}>
                {/* Card header */}
                <div style={s.cardHeader}>
                  <div>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} type="button" onClick={() => setEditRating(n)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 22, color: n <= editRating ? '#D4714E' : '#eaddd6',
                          }}>★</button>
                        ))}
                      </div>
                    ) : (
                      <Stars rating={review.rating} />
                    )}
                    {review.title && !isEditing && (
                      <p style={s.reviewTitle}>{review.title}</p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={s.dateBadge}>{date}</div>
                    {review.productId && (
                      <div style={{ fontSize: 10, color: '#c9aa9e', marginTop: 4, letterSpacing: 0.5 }}>
                        Product: {review.productId.toString().slice(-6).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {review.tags?.length > 0 && !isEditing && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0 0' }}>
                    {review.tags.map(tag => (
                      <span key={tag} style={s.tag}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Review body / edit mode */}
                {isEditing ? (
                  <div style={{ marginTop: 14 }}>
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      style={{ ...s.input, resize: 'vertical', lineHeight: 1.6, marginBottom: 12 }}
                      onFocus={e => e.target.style.borderColor = '#D4714E'}
                      onBlur={e  => e.target.style.borderColor = '#eaddd6'}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleUpdate(review._id)} style={{ ...s.primaryBtn, flex: 1, fontSize: 13, padding: '10px 0' }}>
                        ✓ Save Changes
                      </button>
                      <button onClick={() => setEditId(null)} style={{ ...s.ghostBtn, flex: 1, fontSize: 13, padding: '10px 0' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={s.reviewBody}>{review.review}</p>
                )}

                {/* Actions */}
                {!isEditing && (
                  <div style={s.cardActions}>
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
  writeBtn:    { padding: '8px 20px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
                 color: '#fff', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 600,
                 fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
  page:        { maxWidth: 680, margin: '0 auto', padding: '48px 20px 80px' },
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

  listWrap:    { display: 'flex', flexDirection: 'column', gap: 12 },
  card:        { background: '#fff', borderRadius: 18, border: '1px solid #eaddd6',
                 padding: '22px 24px', overflow: 'hidden' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  reviewTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600,
                 color: '#2d1f17', margin: '6px 0 0' },
  reviewBody:  { fontSize: 14, color: '#5a4038', lineHeight: 1.7, margin: '12px 0 0' },
  dateBadge:   { fontSize: 11, color: '#9b7b6a', background: '#f8f4f0', padding: '3px 10px',
                 borderRadius: 50, fontWeight: 500 },
  tag:         { fontSize: 11, color: '#D4714E', background: '#fff8f5', border: '1px solid #f2dace',
                 padding: '3px 10px', borderRadius: 50, fontWeight: 500 },
  cardActions: { display: 'flex', gap: 8, marginTop: 16, paddingTop: 14,
                 borderTop: '1px solid #f5ede8' },
  actionBtn:   { background: 'none', border: '1.5px solid #eaddd6', borderRadius: 50,
                 padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#7a5a4f',
                 cursor: 'pointer', fontFamily: "'Jost', sans-serif" },
  input:       { padding: '12px 16px', border: '1.5px solid #eaddd6', borderRadius: 12,
                 fontSize: 14, fontFamily: "'Jost', sans-serif", color: '#2d1f17',
                 background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' },
  primaryBtn:  { padding: '14px 32px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
                 color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
                 fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
  ghostBtn:    { padding: '14px 32px', background: '#fff', color: '#7a5a4f',
                 border: '1.5px solid #eaddd6', borderRadius: 50, fontSize: 14, fontWeight: 600,
                 fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
};
=======
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Stars({ rating, size = 16 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{ color: n <= rating ? '#D4714E' : '#eaddd6' }}>★</span>
      ))}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...s.card, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 120, height: 12, borderRadius: 6, background: '#f0e8e2' }} />
        <div style={{ width: 80,  height: 12, borderRadius: 6, background: '#f5efeb' }} />
      </div>
      <div style={{ width: '60%', height: 10, borderRadius: 6, background: '#f5efeb', marginBottom: 10 }} />
      <div style={{ width: '90%', height: 10, borderRadius: 6, background: '#f5efeb', marginBottom: 6  }} />
      <div style={{ width: '75%', height: 10, borderRadius: 6, background: '#f5efeb' }} />
    </div>
  );
}

function EmptyState({ navigate }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 40px' }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>✦</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: '#2d1f17', marginBottom: 8 }}>
        No reviews yet
      </h3>
      <p style={{ color: '#9b7b6a', fontSize: 14, marginBottom: 28 }}>
        Share your experience with an Artisan product you've purchased.
      </p>
      <button onClick={() => navigate('/Users/WriteReview')} style={s.primaryBtn}>
        Write Your First Review →
      </button>
    </div>
  );
}

export default function MyReviews() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem('userId');

  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [deleting,  setDeleting]  = useState(null);
  const [editId,    setEditId]    = useState(null);
  const [editText,  setEditText]  = useState('');
  const [editRating,setEditRating]= useState(0);
  const [toast,     setToast]     = useState({ msg: '', ok: false });

  const showToast = (msg, ok = false) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: false }), 3000);
  };

  const fetchReviews = () => {
    if (!userId) { setError('Please log in to view your reviews.'); setLoading(false); return; }
    setLoading(true);
    axios.get(`http://localhost:7000/review/user/${userId}`)
      .then(res => setReviews(res.data?.reviews || res.data || []))
      .catch(err => setError(err.response?.data?.message || 'Could not load reviews.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, [userId]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    setDeleting(reviewId);
    try {
      await axios.delete(`http://localhost:7000/review/${reviewId}`);
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      showToast('Review deleted.', true);
    } catch (err) {
      showToast('Could not delete: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(null);
    }
  };

  const startEdit = (review) => {
    setEditId(review._id);
    setEditText(review.review);
    setEditRating(review.rating);
  };

  const handleUpdate = async (reviewId) => {
    if (!editText.trim()) return showToast('Review text cannot be empty.');
    try {
      await axios.put(`http://localhost:7000/review/${reviewId}`, {
        review: editText.trim(),
        rating: editRating,
      });
      setReviews(prev => prev.map(r =>
        r._id === reviewId ? { ...r, review: editText.trim(), rating: editRating } : r
      ));
      setEditId(null);
      showToast('Review updated!', true);
    } catch (err) {
      showToast('Could not update: ' + (err.response?.data?.message || err.message));
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div style={s.root}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {toast.msg && (
        <div style={{ ...s.toast, background: toast.ok ? '#2d7a4f' : '#2d1f17' }}>
          {toast.msg}
        </div>
      )}

      <header style={s.header}>
        <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>
        <div style={s.logo}>● Artisan</div>
        <button onClick={() => navigate('/Users/WriteReview')} style={s.writeBtn}>
          + Write Review
        </button>
      </header>

      <div style={s.page}>

        <div style={s.titleBlock}>
          <p style={s.eyebrow}>Your Account</p>
          <h1 style={s.pageTitle}>My <em style={{ color: '#D4714E', fontStyle: 'italic' }}>Reviews</em></h1>
          <p style={s.subtitle}>Everything you've shared with the Artisan community</p>
        </div>

        {/* Summary strip */}
        {!loading && !error && reviews.length > 0 && (
          <div style={s.summaryStrip}>
            <div style={s.summaryItem}>
              <span style={s.summaryVal}>{reviews.length}</span>
              <span style={s.summaryLbl}>Reviews Written</span>
            </div>
            <div style={s.summaryDivider} />
            <div style={s.summaryItem}>
              <span style={s.summaryVal}>{avgRating}</span>
              <span style={s.summaryLbl}>Avg Rating</span>
            </div>
            <div style={s.summaryDivider} />
            <div style={s.summaryItem}>
              <Stars rating={Math.round(avgRating)} size={20} />
              <span style={s.summaryLbl}>Your Score</span>
            </div>
          </div>
        )}

        <div style={s.listWrap}>
          {loading && [1, 2, 3].map(i => <SkeletonCard key={i} />)}

          {!loading && error && (
            <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#D4714E', fontWeight: 600 }}>⚠ {error}</p>
            </div>
          )}

          {!loading && !error && reviews.length === 0 && (
            <EmptyState navigate={navigate} />
          )}

          {!loading && !error && reviews.map(review => {
            const isEditing = editId === review._id;
            const date = review.createdAt
              ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : '';

            return (
              <div key={review._id} style={s.card}>
                {/* Card header */}
                <div style={s.cardHeader}>
                  <div>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} type="button" onClick={() => setEditRating(n)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 22, color: n <= editRating ? '#D4714E' : '#eaddd6',
                          }}>★</button>
                        ))}
                      </div>
                    ) : (
                      <Stars rating={review.rating} />
                    )}
                    {review.title && !isEditing && (
                      <p style={s.reviewTitle}>{review.title}</p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={s.dateBadge}>{date}</div>
                    {review.productId && (
                      <div style={{ fontSize: 10, color: '#c9aa9e', marginTop: 4, letterSpacing: 0.5 }}>
                        Product: {review.productId.toString().slice(-6).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {review.tags?.length > 0 && !isEditing && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '10px 0 0' }}>
                    {review.tags.map(tag => (
                      <span key={tag} style={s.tag}>{tag}</span>
                    ))}
                  </div>
                )}

                {/* Review body / edit mode */}
                {isEditing ? (
                  <div style={{ marginTop: 14 }}>
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      style={{ ...s.input, resize: 'vertical', lineHeight: 1.6, marginBottom: 12 }}
                      onFocus={e => e.target.style.borderColor = '#D4714E'}
                      onBlur={e  => e.target.style.borderColor = '#eaddd6'}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleUpdate(review._id)} style={{ ...s.primaryBtn, flex: 1, fontSize: 13, padding: '10px 0' }}>
                        ✓ Save Changes
                      </button>
                      <button onClick={() => setEditId(null)} style={{ ...s.ghostBtn, flex: 1, fontSize: 13, padding: '10px 0' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={s.reviewBody}>{review.review}</p>
                )}

                {/* Actions */}
                {!isEditing && (
                  <div style={s.cardActions}>
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
  writeBtn:    { padding: '8px 20px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
                 color: '#fff', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 600,
                 fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
  page:        { maxWidth: 680, margin: '0 auto', padding: '48px 20px 80px' },
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

  listWrap:    { display: 'flex', flexDirection: 'column', gap: 12 },
  card:        { background: '#fff', borderRadius: 18, border: '1px solid #eaddd6',
                 padding: '22px 24px', overflow: 'hidden' },
  cardHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  reviewTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600,
                 color: '#2d1f17', margin: '6px 0 0' },
  reviewBody:  { fontSize: 14, color: '#5a4038', lineHeight: 1.7, margin: '12px 0 0' },
  dateBadge:   { fontSize: 11, color: '#9b7b6a', background: '#f8f4f0', padding: '3px 10px',
                 borderRadius: 50, fontWeight: 500 },
  tag:         { fontSize: 11, color: '#D4714E', background: '#fff8f5', border: '1px solid #f2dace',
                 padding: '3px 10px', borderRadius: 50, fontWeight: 500 },
  cardActions: { display: 'flex', gap: 8, marginTop: 16, paddingTop: 14,
                 borderTop: '1px solid #f5ede8' },
  actionBtn:   { background: 'none', border: '1.5px solid #eaddd6', borderRadius: 50,
                 padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#7a5a4f',
                 cursor: 'pointer', fontFamily: "'Jost', sans-serif" },
  input:       { padding: '12px 16px', border: '1.5px solid #eaddd6', borderRadius: 12,
                 fontSize: 14, fontFamily: "'Jost', sans-serif", color: '#2d1f17',
                 background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' },
  primaryBtn:  { padding: '14px 32px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
                 color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
                 fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
  ghostBtn:    { padding: '14px 32px', background: '#fff', color: '#7a5a4f',
                 border: '1.5px solid #eaddd6', borderRadius: 50, fontSize: 14, fontWeight: 600,
                 fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
};
>>>>>>> 82215cb8c94d441cfeccaf739c52fd84b83763c3
