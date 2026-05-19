import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const UPI_APPS = ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Other UPI'];

const PAYMENT_METHODS = [
  { id: 'upi',     label: 'UPI',                sub: 'GPay, PhonePe, Paytm…' },
  { id: 'card',    label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
  { id: 'netbank', label: 'Net Banking',          sub: 'All major banks' },
  { id: 'cod',     label: 'Cash on Delivery',     sub: 'Pay when it arrives' },
];

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId   = localStorage.getItem('userId');

  const { booking, productID } = location.state || {};

  const [payMethod,   setPayMethod]   = useState('upi');
  const [upiApp,      setUpiApp]      = useState('GPay');
  const [upiId,       setUpiId]       = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [bank,        setBank]        = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [toast,       setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  if (!booking || !productID) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8f4f0', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif" }}>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <h2 style={{ color: '#2d1f17', marginBottom: 8 }}>No booking found</h2>
          <p style={{ color: '#9b7b6a', marginBottom: 24 }}>Please complete your booking details first.</p>
          <button onClick={() => navigate(-1)} style={s.primaryBtn}>← Go Back</button>
        </div>
      </div>
    );
  }

  const buildPaymentInfo = () => {
    if (payMethod === 'upi')     return { method: 'upi', upiApp, upiId };
    if (payMethod === 'card')    return { method: 'card', ...cardDetails };
    if (payMethod === 'netbank') return { method: 'netbank', bank };
    return { method: 'cod' };
  };

  const validatePayment = () => {
    if (payMethod === 'upi' && !upiId.trim())
      return 'Please enter your UPI ID';
    if (payMethod === 'card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)
        return 'Please fill all card details';
    }
    if (payMethod === 'netbank' && !bank)
      return 'Please select your bank';
    return null;
  };

  const handleConfirm = async () => {
  const payErr = validatePayment();
  if (payErr) { showToast(payErr); return; }

  // Safe amount parsing — strip commas/symbols before converting
  const rawAmount = String(booking.totalamount).replace(/[^0-9.]/g, '');
  const totalamount = parseFloat(rawAmount);

  if (isNaN(totalamount)) {
    showToast('Invalid booking amount. Please go back and retry.');
    return;
  }

  const payload = {
    ...booking,
    userId,
    productID,
    totalamount,
    paymentInfo: buildPaymentInfo(),
    paymentStatus: payMethod === 'cod' ? 'unpaid' : 'pending',
  };

  console.log('Sending payload:', payload); // ← check this in DevTools

  setSubmitting(true);
  try {
    const res = await axios.post('http://localhost:7000/booking/create', payload);
    console.log('Response:', res.data);
    showToast('✓ Booking confirmed!');
    setTimeout(() => navigate('/Users/ViewProduct'), 1500);
  } catch (error) {
    console.error('Full error:', error.response); // ← check status + data here
    const msg = error.response?.data?.message
      || error.response?.data?.error
      || JSON.stringify(error.response?.data)
      || error.message;
    showToast('Booking failed: ' + msg);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div style={s.root}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      {toast && <div style={s.toast}>{toast}</div>}

      <header style={s.header}>
        <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>
        <div style={s.logo}>● Artisan</div>
        <div />
      </header>

      {/* ✅ Only formCard, no summaryCard, no container wrapper */}
      <div style={s.formCard}>
        <p style={s.eyebrow}>Step 2 of 2</p>
        <h2 style={s.formTitle}>Choose <em style={{ color: '#D4714E', fontStyle: 'italic' }}>Payment</em></h2>

        <label style={s.label}>Payment Method</label>
        <div style={s.methodGrid}>
          {PAYMENT_METHODS.map(m => (
            <button key={m.id} onClick={() => setPayMethod(m.id)} style={{
              ...s.methodBtn,
              border:     payMethod === m.id ? '2px solid #D4714E' : '1.5px solid #eaddd6',
              background: payMethod === m.id ? '#fff8f5' : '#fff',
            }}>
              <span style={{ fontWeight: 500, color: '#2d1f17', fontSize: 14 }}>{m.label}</span>
              <span style={{ fontSize: 11, color: '#9b7b6a', marginTop: 2 }}>{m.sub}</span>
            </button>
          ))}
        </div>

        {/* UPI */}
        {payMethod === 'upi' && (
          <div style={s.paySection}>
            <label style={{ ...s.label, marginBottom: 10 }}>Choose UPI App</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              {UPI_APPS.map(app => (
                <button key={app} onClick={() => setUpiApp(app)} style={{
                  padding: '7px 16px', borderRadius: 50, fontSize: 13,
                  fontFamily: "'Jost', sans-serif", cursor: 'pointer', fontWeight: 500,
                  border:     upiApp === app ? '2px solid #D4714E' : '1.5px solid #eaddd6',
                  background: upiApp === app ? '#fff8f5' : '#fff',
                  color:      upiApp === app ? '#D4714E'  : '#2d1f17',
                }}>{app}</button>
              ))}
            </div>
            <label style={s.label}>UPI ID</label>
            <input
              type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
              placeholder="yourname@upi" style={{ ...s.input, marginTop: 6 }}
              onFocus={e => e.target.style.borderColor = '#D4714E'}
              onBlur={e  => e.target.style.borderColor = '#eaddd6'}
            />
          </div>
        )}

        {/* Card */}
        {payMethod === 'card' && (
          <div style={s.paySection}>
            {[
              { label: 'Card Number',     key: 'number', placeholder: '1234 5678 9012 3456', type: 'text' },
              { label: 'Cardholder Name', key: 'name',   placeholder: 'John Doe',             type: 'text' },
              { label: 'Expiry (MM/YY)',  key: 'expiry', placeholder: '08/27',                type: 'text' },
              { label: 'CVV',             key: 'cvv',    placeholder: '•••',                  type: 'password' },
            ].map(f => (
              <div key={f.key} style={{ ...s.fieldWrap, marginBottom: 12 }}>
                <label style={s.label}>{f.label}</label>
                <input
                  type={f.type} value={cardDetails[f.key]}
                  onChange={e => setCardDetails({ ...cardDetails, [f.key]: e.target.value })}
                  placeholder={f.placeholder} style={s.input}
                  onFocus={e => e.target.style.borderColor = '#D4714E'}
                  onBlur={e  => e.target.style.borderColor = '#eaddd6'}
                />
              </div>
            ))}
          </div>
        )}

        {/* Net Banking */}
        {payMethod === 'netbank' && (
          <div style={s.paySection}>
            <label style={s.label}>Select Bank</label>
            <select value={bank} onChange={e => setBank(e.target.value)}
              style={{ ...s.input, marginTop: 6, cursor: 'pointer' }}>
              <option value="">— Select your bank —</option>
              {['SBI','HDFC Bank','ICICI Bank','Axis Bank','Kotak Bank',
                'Bank of Baroda','Canara Bank','Punjab National Bank','Other'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {/* COD */}
        {payMethod === 'cod' && (
          <div style={{ ...s.paySection, background: '#fdf6f0', border: '1.5px solid #f2dace' }}>
            <p style={{ margin: 0, fontSize: 13, color: '#9b7b6a', lineHeight: 1.6 }}>
              You'll pay <strong style={{ color: '#D4714E' }}>
                ₹{Number(booking.totalamount).toLocaleString('en-IN')}
              </strong> in cash when your order arrives.
            </p>
          </div>
        )}

        <button onClick={handleConfirm} disabled={submitting} style={{
          ...s.primaryBtn, width: '100%', marginTop: 28, fontSize: 15,
          opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer',
        }}>
          {submitting ? 'Confirming…' : '✓ Confirm & Pay'}
        </button>
      </div>
    </div>
  );
}

const s = {
  root:       { minHeight: '100vh', background: '#f8f4f0', fontFamily: "'Jost', sans-serif" },
  toast:      { position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
                background: '#2d1f17', color: '#fff', fontSize: 13, fontWeight: 500,
                padding: '11px 28px', borderRadius: 50, zIndex: 9999 },
  header:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 40px', height: 68, background: 'rgba(248,244,240,0.95)',
                borderBottom: '1px solid rgba(212,113,78,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  backBtn:    { background: 'none', border: '1.5px solid #eaddd6', borderRadius: 50,
                padding: '8px 20px', fontSize: 13, color: '#7a5a4f', cursor: 'pointer',
                fontFamily: "'Jost', sans-serif" },
  logo:       { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#2d1f17' },
  eyebrow:    { fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: '#D4714E', marginBottom: 10 },
  formCard:   { background: '#fff', borderRadius: 24, padding: 40, border: '1px solid #eee5df',
                maxWidth: 600, margin: '48px auto' },  // ✅ centered, no flex container needed
  formTitle:  { fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 600,
                color: '#2d1f17', marginBottom: 28, lineHeight: 1.2 },
  fieldWrap:  { display: 'flex', flexDirection: 'column', gap: 6 },
  label:      { fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9b7b6a' },
  input:      { padding: '12px 16px', border: '1.5px solid #eaddd6', borderRadius: 12,
                fontSize: 14, fontFamily: "'Jost', sans-serif", color: '#2d1f17',
                background: '#fff', outline: 'none', width: '100%', boxSizing: 'border-box' },
  methodGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10, marginBottom: 8 },
  methodBtn:  { display: 'flex', flexDirection: 'column', padding: '12px 14px', borderRadius: 12,
                cursor: 'pointer', textAlign: 'left', fontFamily: "'Jost', sans-serif" },
  paySection: { marginTop: 16, padding: 18, borderRadius: 12, background: '#fafafa', border: '1.5px solid #eaddd6' },
  primaryBtn: { padding: '14px 32px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
                color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
                fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
};