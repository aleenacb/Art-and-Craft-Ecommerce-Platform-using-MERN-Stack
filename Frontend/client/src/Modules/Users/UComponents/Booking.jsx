import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Booking() {
  const location    = useLocation();
  const navigate    = useNavigate();
  const productID   = location.state?.productId   || null;
  const productName = location.state?.productName || 'Product';
  const userId      = localStorage.getItem('userId');

  const [booking, setBooking] = useState({
    fullname: '', email: '', phone: '', address: '', quantity: '', totalamount: '',
  });
  const [price, setPrice] = useState(0);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    if (!productID) return;
    axios.get(`http://localhost:7000/product/getProductById/${productID}`)
      .then(res => setPrice(res.data.pdata.price))
      .catch(err => console.log(err));
  }, [productID]);

  const handleChange = (e) => {
    if (e.target.name === 'quantity') {
      const qty = Number(e.target.value);
      setBooking({ ...booking, quantity: qty, totalamount: qty * price });
    } else {
      setBooking({ ...booking, [e.target.name]: e.target.value });
    }
  };

  const handleProceed = () => {
    if (!userId) { alert('Please login first'); navigate('/Users/Login'); return; }
    if (!booking.fullname || !booking.email || !booking.phone || !booking.address || !booking.quantity) {
      showToast('Please fill all fields'); return;
    }
    navigate('/Users/Payment', {
      state: { booking, productID, productName, price }
    });
  };

  if (!productID) return (
    <div style={{ minHeight: '100vh', background: '#f8f4f0', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif" }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <h2 style={{ color: '#2d1f17', marginBottom: 8 }}>No product selected</h2>
        <p style={{ color: '#9b7b6a', marginBottom: 24 }}>Please go back and choose a product first.</p>
        <button onClick={() => navigate(-1)} style={s.primaryBtn}>← Go Back</button>
      </div>
    </div>
  );

  return (
    <div style={s.root}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      {toast && <div style={s.toast}>{toast}</div>}

      <header style={s.header}>
        <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>
        <div style={s.logo}>● Artisan</div>
        <div />
      </header>

      {/* ✅ Only formCard, centered, no summaryCard */}
      <div style={s.formCard}>
        <p style={s.eyebrow}>Your Details</p>
        <h2 style={s.formTitle}>Complete <em style={{ color: '#D4714E', fontStyle: 'italic' }}>Booking</em></h2>

        <div style={s.formGrid}>
          {[
            { label: 'Full Name', name: 'fullname', type: 'text',   placeholder: 'John Doe' },
            { label: 'Email',     name: 'email',    type: 'email',  placeholder: 'john@example.com' },
            { label: 'Phone',     name: 'phone',    type: 'number', placeholder: '9876543210' },
            { label: 'Quantity',  name: 'quantity', type: 'number', placeholder: '1' },
          ].map(field => (
            <div key={field.name} style={s.fieldWrap}>
              <label style={s.label}>{field.label}</label>
              <input
                type={field.type} name={field.name}
                value={booking[field.name]} onChange={handleChange}
                placeholder={field.placeholder} style={s.input}
                onFocus={e => e.target.style.borderColor = '#D4714E'}
                onBlur={e  => e.target.style.borderColor = '#eaddd6'}
              />
            </div>
          ))}
        </div>

        <div style={{ ...s.fieldWrap, marginTop: 16 }}>
          <label style={s.label}>Delivery Address</label>
          <textarea
            name="address" value={booking.address} onChange={handleChange}
            placeholder="Enter your full delivery address…" rows={3}
            style={{ ...s.input, resize: 'vertical', minHeight: 80 }}
            onFocus={e => e.target.style.borderColor = '#D4714E'}
            onBlur={e  => e.target.style.borderColor = '#eaddd6'}
          />
        </div>

        <div style={{ ...s.fieldWrap, marginTop: 16 }}>
          <label style={s.label}>Total Amount</label>
          <input type="text" readOnly
            value={booking.totalamount ? `₹${Number(booking.totalamount).toLocaleString('en-IN')}` : ''}
            placeholder="Auto calculated"
            style={{ ...s.input, background: '#fdf6f0', color: '#D4714E', fontWeight: 600, cursor: 'not-allowed' }}
          />
        </div>

        <button onClick={handleProceed} style={{ ...s.primaryBtn, width: '100%', marginTop: 24, fontSize: 15 }}>
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}

const s = {
  root:      { minHeight: '100vh', background: '#f8f4f0', fontFamily: "'Jost', sans-serif" },
  toast:     { position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
               background: '#2d1f17', color: '#fff', fontSize: 13, fontWeight: 500,
               padding: '11px 28px', borderRadius: 50, zIndex: 9999 },
  header:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
               padding: '0 40px', height: 68, background: 'rgba(248,244,240,0.95)',
               borderBottom: '1px solid rgba(212,113,78,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  backBtn:   { background: 'none', border: '1.5px solid #eaddd6', borderRadius: 50,
               padding: '8px 20px', fontSize: 13, color: '#7a5a4f', cursor: 'pointer',
               fontFamily: "'Jost', sans-serif" },
  logo:      { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#2d1f17' },
  eyebrow:   { fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: '#D4714E', marginBottom: 10 },
  formCard:  { background: '#fff', borderRadius: 24, padding: 40, border: '1px solid #eee5df',
               maxWidth: 600, margin: '48px auto' },   // ✅ centered
  formTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 600,
               color: '#2d1f17', marginBottom: 28, lineHeight: 1.2 },
  formGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label:     { fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9b7b6a' },
  input:     { padding: '12px 16px', border: '1.5px solid #eaddd6', borderRadius: 12,
               fontSize: 14, fontFamily: "'Jost', sans-serif", color: '#2d1f17',
               background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' },
  primaryBtn:{ padding: '14px 32px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
               color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
               fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
};