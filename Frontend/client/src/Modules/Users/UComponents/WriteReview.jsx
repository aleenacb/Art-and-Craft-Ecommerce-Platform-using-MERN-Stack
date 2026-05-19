import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TAGS = ['Great quality', 'Fast delivery', 'Beautiful craft', 'True to description', 'Well packaged', 'Would gift it'];

const RATING_OPTIONS = [
  { value: 1, label: 'Poor',        color: '#D4714E', bg: '#fff0ee', border: '#D4714E' },
  { value: 2, label: 'Fair',        color: '#e8913d', bg: '#fff5ea', border: '#e8913d' },
  { value: 3, label: 'Good',        color: '#b8902a', bg: '#fffbea', border: '#d4aa30' },
  { value: 4, label: 'Great',       color: '#3a8f48', bg: '#eef8ef', border: '#4aad5a' },
  { value: 5, label: 'Outstanding', color: '#3a6dd4', bg: '#eef4ff', border: '#5b8dee' },
];

function RatingPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
      {RATING_OPTIONS.map(opt => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: '9px 20px',
              borderRadius: 50,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Jost', sans-serif",
              cursor: 'pointer',
              letterSpacing: 0.3,
              border: `1.5px solid ${active ? opt.border : '#eaddd6'}`,
              background: active ? opt.bg : '#fff',
              color: active ? opt.color : '#9b7b6a',
              transition: 'all 0.15s ease',
              transform: active ? 'scale(1.04)' : 'scale(1)',
              boxShadow: active ? `0 2px 10px ${opt.border}33` : 'none',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function WriteReview() {
  const navigate  = useNavigate();
  const userId    = localStorage.getItem('userId');
  const userName  = localStorage.getItem('userName') || 'Anonymous';

  const [rating,       setRating]       = useState(0);
  const [title,        setTitle]        = useState('');
  const [review,       setReview]       = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [productName,  setProductName]  = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [toast,        setToast]        = useState({ msg: '', ok: false });

  const showToast = (msg, ok = false) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: false }), 3000);
  };

  const toggleTag = (tag) =>
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );

  const handleSubmit = async () => {
    if (!rating)             return showToast('Please choose a rating');
    if (!review.trim())      return showToast('Please write your review');
    if (!productName.trim()) return showToast('Please enter a product name');

    setSubmitting(true);
    try {
      await axios.post('http://localhost:7000/review/create', {
        userId,
        userName,
        productName: productName.trim(),
        rating,
        title:  title.trim(),
        review: review.trim(),
        tags:   selectedTags,
      });
      showToast('✓ Review submitted! Thank you.', true);
      setRating(0); setTitle(''); setReview(''); setSelectedTags([]); setProductName('');
    } catch (err) {
      showToast('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

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
        <div style={{ width: 80 }} />
      </header>

      <div style={s.page}>
        <div style={s.titleBlock}>
          <p style={s.eyebrow}>Share Your Experience</p>
          <h1 style={s.pageTitle}>Write a <em style={{ color: '#D4714E', fontStyle: 'italic' }}>Review</em></h1>
          <p style={s.subtitle}>Your honest feedback helps other buyers and our artisans grow</p>
        </div>

        <div style={s.card}>

          {/* ── Product Name ── */}
          <div style={s.fieldWrap}>
            <label style={s.label}>
              Product Name <span style={{ color: '#D4714E' }}>*</span>
            </label>
            <input
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="Enter the product name you're reviewing"
              maxLength={120}
              style={s.input}
              onFocus={e => e.target.style.borderColor = '#D4714E'}
              onBlur={e  => e.target.style.borderColor = '#eaddd6'}
            />
          </div>

          {/* ── Rating Pills ── */}
          <div style={s.fieldWrap}>
            <label style={s.label}>
              Your Rating <span style={{ color: '#D4714E' }}>*</span>
            </label>
            <RatingPicker value={rating} onChange={setRating} />
            {rating > 0 && (
              <span style={{ fontSize: 12, color: RATING_OPTIONS[rating - 1].color, fontWeight: 600, marginTop: 4 }}>
                You rated: {RATING_OPTIONS[rating - 1].label}
              </span>
            )}
          </div>

          {/* ── Quick Tags ── */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Quick Tags <span style={s.optional}>(optional)</span></label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
              {TAGS.map(tag => {
                const active = selectedTags.includes(tag);
                return (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{
                    padding: '7px 14px', borderRadius: 50, fontSize: 12, fontWeight: 500,
                    fontFamily: "'Jost', sans-serif", cursor: 'pointer', letterSpacing: 0.3,
                    border:     active ? '1.5px solid #D4714E' : '1.5px solid #eaddd6',
                    background: active ? '#fff8f5' : '#fff',
                    color:      active ? '#D4714E' : '#7a5a4f',
                    transition: 'all 0.15s ease',
                  }}>
                    {active ? '✓ ' : ''}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Review Title ── */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Review Title <span style={s.optional}>(optional)</span></label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Summarise your experience in a few words"
              maxLength={80}
              style={s.input}
              onFocus={e => e.target.style.borderColor = '#D4714E'}
              onBlur={e  => e.target.style.borderColor = '#eaddd6'}
            />
          </div>

          {/* ── Review Body ── */}
          <div style={s.fieldWrap}>
            <label style={s.label}>Your Review <span style={{ color: '#D4714E' }}>*</span></label>
            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Tell us about the quality, craftsmanship, packaging, and anything that stood out…"
              rows={5}
              maxLength={1000}
              style={{ ...s.input, resize: 'vertical', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = '#D4714E'}
              onBlur={e  => e.target.style.borderColor = '#eaddd6'}
            />
            <span style={{ ...s.hint, textAlign: 'right' }}>{review.length}/1000</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              ...s.primaryBtn, width: '100%', marginTop: 8, fontSize: 15,
              opacity: submitting ? 0.7 : 1,
              cursor:  submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Submitting…' : '✦ Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  root:           { minHeight: '100vh', background: '#f8f4f0', fontFamily: "'Jost', sans-serif" },
  toast:          { position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
                    color: '#fff', fontSize: 13, fontWeight: 500, padding: '11px 28px',
                    borderRadius: 50, zIndex: 9999, whiteSpace: 'nowrap' },
  header:         { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 40px', height: 68, background: 'rgba(248,244,240,0.95)',
                    borderBottom: '1px solid rgba(212,113,78,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  backBtn:        { background: 'none', border: '1.5px solid #eaddd6', borderRadius: 50,
                    padding: '8px 20px', fontSize: 13, color: '#7a5a4f', cursor: 'pointer',
                    fontFamily: "'Jost', sans-serif" },
  logo:           { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#2d1f17' },
  page:           { maxWidth: 620, margin: '0 auto', padding: '48px 20px 80px' },
  titleBlock:     { marginBottom: 32 },
  eyebrow:        { fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase',
                    color: '#D4714E', margin: '0 0 10px 0' },
  pageTitle:      { fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 600,
                    color: '#2d1f17', margin: '8px 0 6px', lineHeight: 1.1 },
  subtitle:       { fontSize: 14, color: '#9b7b6a', margin: 0 },
  card:           { background: '#fff', borderRadius: 24, padding: 40, border: '1px solid #eaddd6',
                    display: 'flex', flexDirection: 'column', gap: 24 },
  fieldWrap:      { display: 'flex', flexDirection: 'column', gap: 8 },
  label:          { fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9b7b6a' },
  optional:       { fontWeight: 400, letterSpacing: 0, textTransform: 'none', fontSize: 11, color: '#c9aa9e' },
  hint:           { fontSize: 11, color: '#c9aa9e', marginTop: 2 },
  input:          { padding: '12px 16px', border: '1.5px solid #eaddd6', borderRadius: 12,
                    fontSize: 14, fontFamily: "'Jost', sans-serif", color: '#2d1f17',
                    background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' },
  primaryBtn:     { padding: '14px 32px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
                    color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
                    fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
};
