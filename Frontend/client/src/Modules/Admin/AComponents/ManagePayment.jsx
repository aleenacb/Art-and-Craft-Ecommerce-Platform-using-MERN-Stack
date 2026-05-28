import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  paid:    { label: 'Paid',             bg: '#f0faf4', color: '#2d7a4f', dot: '#34c47c' },
  pending: { label: 'Pending',          bg: '#fff8f0', color: '#a05a00', dot: '#f5a623' },
  unpaid:  { label: 'Cash on Delivery', bg: '#f5f5f5', color: '#5a5a5a', dot: '#aaaaaa' },
  failed:  { label: 'Failed',           bg: '#fff0f0', color: '#a02020', dot: '#e05555' },
};

const METHOD_ICON = {
  upi:     '⚡',
  card:    '💳',
  netbank: '🏦',
  cod:     '🏠',
};

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.8,
      padding: '4px 10px', borderRadius: 50,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
}

function EmptyState({ navigate }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 40px' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🧾</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: '#2d1f17', marginBottom: 8 }}>
        No transactions yet
      </h3>
      <p style={{ color: '#9b7b6a', fontSize: 14, marginBottom: 28 }}>
        Your payment history will appear here after your first booking.
      </p>
      <button onClick={() => navigate('/Users/ViewProduct')} style={s.primaryBtn}>
        Browse Products →
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ ...s.card, padding: '20px 24px' }}>
      {[1, 2].map(i => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i === 1 ? 14 : 0 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f0e8e2' }} />
            <div>
              <div style={{ width: 140, height: 12, borderRadius: 6, background: '#f0e8e2', marginBottom: 8 }} />
              <div style={{ width: 90, height: 10, borderRadius: 6, background: '#f5efeb' }} />
            </div>
          </div>
          <div style={{ width: 70, height: 14, borderRadius: 6, background: '#f0e8e2' }} />
        </div>
      ))}
    </div>
  );
}

function ErrorCard({ type, message, navigate }) {
  if (type === 'auth') {
    return (
      <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
        <p style={{ color: '#2d1f17', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Please log in</p>
        <p style={{ color: '#9b7b6a', fontSize: 13, marginBottom: 24 }}>
          You need to be logged in to view payment history.
        </p>
        {/* Update this path to match your actual login route */}
        <button onClick={() => navigate('/Users/Login')} style={s.primaryBtn}>Log In</button>
      </div>
    );
  }
  if (type === 'no-endpoint') {
    return (
      <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔧</div>
        <p style={{ color: '#2d1f17', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Backend route missing</p>
        <p style={{ color: '#9b7b6a', fontSize: 13, lineHeight: 1.6 }}>
          Add{' '}
          <code style={{ background: '#f5efeb', padding: '2px 8px', borderRadius: 4, color: '#D4714E' }}>
            GET /booking/user/:userId
          </code>{' '}
          to your Express backend and return an array of the user's bookings.
        </p>
      </div>
    );
  }
  return (
    <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
      <p style={{ color: '#D4714E', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Could not load history</p>
      <p style={{ color: '#9b7b6a', fontSize: 13 }}>{message}</p>
    </div>
  );
}

function DetailRow({ label, value, bold }) {
  return (
    <div style={s.detailRow}>
      <span style={s.detailLabel}>{label}</span>
      <span style={{ ...s.detailValue, fontWeight: bold ? 600 : 400, color: bold ? '#2d1f17' : '#5a4038' }}>
        {value}
      </span>
    </div>
  );
}

export default function ManagePayment() {
  const navigate = useNavigate();
  const userId   = localStorage.getItem('userId');

  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null); // { type, message }
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
  axios.get('http://localhost:7000/booking/getAll')  // ✅ fetch ALL bookings for admin
    .then(res => setBookings(res.data?.bdata || res.data || []))
    .catch(err => {
      const status = err.response?.status;
      if (status === 404) {
        setError({ type: 'no-endpoint' });
      } else {
        setError({ type: 'generic', message: err.response?.data?.message || err.message });
      }
    })
    .finally(() => setLoading(false));
}, []);

  const filters = ['all', 'paid', 'pending', 'unpaid', 'failed'];

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => (b.paymentStatus || 'pending') === filter);

  const totalPaid = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + Number(b.totalamount || 0), 0);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div style={s.root}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <header style={s.header}>
        <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>
        <div style={s.logo}>● Artisan</div>
        <div style={{ width: 80 }} />
      </header>

      <div style={s.page}>

        <div style={s.titleBlock}>
          <p style={s.eyebrow}>Your Account</p>
          <h1 style={s.pageTitle}>
            Payment <em style={{ color: '#D4714E', fontStyle: 'italic' }}>History</em>
          </h1>
          <p style={s.subtitle}>All your transactions in one place</p>
        </div>

        {/* Summary strip */}
        {!loading && !error && bookings.length > 0 && (
          <div style={s.summaryStrip}>
            <div style={s.summaryItem}>
              <span style={s.summaryVal}>{bookings.length}</span>
              <span style={s.summaryLbl}>Total Orders</span>
            </div>
            <div style={s.summaryDivider} />
            <div style={s.summaryItem}>
              <span style={s.summaryVal}>₹{totalPaid.toLocaleString('en-IN')}</span>
              <span style={s.summaryLbl}>Amount Paid</span>
            </div>
            <div style={s.summaryDivider} />
            <div style={s.summaryItem}>
              <span style={s.summaryVal}>{bookings.filter(b => b.paymentStatus === 'pending').length}</span>
              <span style={s.summaryLbl}>Pending</span>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        {!loading && !error && bookings.length > 0 && (
          <div style={s.filterRow}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                ...s.filterBtn,
                background: filter === f ? '#2d1f17' : '#fff',
                color:      filter === f ? '#fff'    : '#7a5a4f',
                border:     filter === f ? '1.5px solid #2d1f17' : '1.5px solid #eaddd6',
              }}>
                {f === 'all' ? 'All' : (STATUS_CONFIG[f]?.label || f)}
              </button>
            ))}
          </div>
        )}

        <div style={s.listWrap}>
          {loading && [1, 2, 3].map(i => <SkeletonCard key={i} />)}

          {!loading && error && (
            <ErrorCard type={error.type} message={error.message} navigate={navigate} />
          )}

          {!loading && !error && filtered.length === 0 && bookings.length === 0 && (
            <EmptyState navigate={navigate} />
          )}

          {!loading && !error && filtered.length === 0 && bookings.length > 0 && (
            <div style={{ ...s.card, padding: 40, textAlign: 'center' }}>
              <p style={{ color: '#9b7b6a', fontSize: 14 }}>No {filter} transactions found.</p>
            </div>
          )}

          {!loading && !error && filtered.map((booking, idx) => {
            const status  = booking.paymentStatus || 'pending';
            const method  = booking.paymentInfo?.method || 'upi';
            const cardKey = booking._id || idx;
            const isOpen  = expanded === cardKey;
            const amount  = Number(booking.totalamount || 0);
            const date    = booking.createdAt
              ? new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'N/A';
            const time    = booking.createdAt
              ? new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div key={cardKey} style={s.card}>
                <button onClick={() => toggle(cardKey)} style={s.cardBtn}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                    <div style={s.methodIconBox}>
                      <span style={{ fontSize: 20 }}>{METHOD_ICON[method] || '💳'}</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                        <span style={s.orderTitle}>
                          Order #{cardKey.toString().slice(-6).toUpperCase()}
                        </span>
                        <Badge status={status} />
                      </div>
                      <div style={{ fontSize: 12, color: '#9b7b6a' }}>
                        {date}{time && ` · ${time}`}
                        {booking.paymentInfo?.upiApp && ` · ${booking.paymentInfo.upiApp}`}
                        {booking.paymentInfo?.bank   && ` · ${booking.paymentInfo.bank}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <div style={s.amountText}>₹{amount.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 11, color: '#c9aa9e', marginTop: 2 }}>
                      {isOpen ? '▲ Less' : '▼ Details'}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div style={s.detail}>
                    <div style={s.detailGrid}>
                      <DetailRow label="Payment Method" value={method.toUpperCase()} />
                      {booking.paymentInfo?.upiId  && <DetailRow label="UPI ID"       value={booking.paymentInfo.upiId} />}
                      {booking.paymentInfo?.upiApp && <DetailRow label="UPI App"      value={booking.paymentInfo.upiApp} />}
                      {booking.paymentInfo?.bank   && <DetailRow label="Bank"         value={booking.paymentInfo.bank} />}
                      {booking.paymentInfo?.name   && <DetailRow label="Card Name"    value={booking.paymentInfo.name} />}
                      {booking.paymentInfo?.number && (
                        <DetailRow label="Card Number" value={'•••• •••• •••• ' + booking.paymentInfo.number.slice(-4)} />
                      )}
                      <DetailRow label="Date" value={date} />
                      {booking.checkIn  && <DetailRow label="Check-in"  value={new Date(booking.checkIn).toLocaleDateString('en-IN')} />}
                      {booking.checkOut && <DetailRow label="Check-out" value={new Date(booking.checkOut).toLocaleDateString('en-IN')} />}
                      {booking.guests   && <DetailRow label="Guests"    value={booking.guests} />}
                      <DetailRow label="Total Amount" value={`₹${amount.toLocaleString('en-IN')}`} bold />
                      <DetailRow label="Status"       value={STATUS_CONFIG[status]?.label || status} bold />
                    </div>
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
  header:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                 padding: '0 40px', height: 68, background: 'rgba(248,244,240,0.95)',
                 borderBottom: '1px solid rgba(212,113,78,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  backBtn:     { background: 'none', border: '1.5px solid #eaddd6', borderRadius: 50,
                 padding: '8px 20px', fontSize: 13, color: '#7a5a4f', cursor: 'pointer',
                 fontFamily: "'Jost', sans-serif" },
  logo:        { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#2d1f17' },
  page:        { maxWidth: 680, margin: '0 auto', padding: '48px 20px 80px' },
  titleBlock:  { marginBottom: 32 },
  eyebrow:     { fontSize: 10, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase',
                 color: '#D4714E', margin: '0 0 10px 0' },
  pageTitle:   { fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 600,
                 color: '#2d1f17', margin: '8px 0 6px', lineHeight: 1.1 },
  subtitle:    { fontSize: 14, color: '#9b7b6a', margin: 0 },

  summaryStrip:  { display: 'flex', alignItems: 'center', justifyContent: 'space-around',
                   background: '#fff', border: '1px solid #eaddd6', borderRadius: 16,
                   padding: '20px 0', marginBottom: 20 },
  summaryItem:   { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  summaryVal:    { fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: '#2d1f17' },
  summaryLbl:    { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9b7b6a', fontWeight: 600 },
  summaryDivider:{ width: 1, height: 40, background: '#eaddd6' },

  filterRow:   { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  filterBtn:   { padding: '7px 16px', borderRadius: 50, fontSize: 12, fontWeight: 600,
                 fontFamily: "'Jost', sans-serif", cursor: 'pointer', letterSpacing: 0.5 },

  listWrap:    { display: 'flex', flexDirection: 'column', gap: 12 },
  card:        { background: '#fff', borderRadius: 18, border: '1px solid #eaddd6', overflow: 'hidden' },

  // ✅ Fixed: gap is now a proper style property, not embedded in a string
  cardBtn:     { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                 gap: 12, padding: '20px 22px', background: 'none', border: 'none', cursor: 'pointer',
                 fontFamily: "'Jost', sans-serif" },

  methodIconBox: { width: 46, height: 46, borderRadius: 14, background: '#fdf6f0',
                   border: '1.5px solid #f2dace', display: 'flex', alignItems: 'center',
                   justifyContent: 'center', flexShrink: 0 },

  orderTitle:  { fontWeight: 600, fontSize: 14, color: '#2d1f17', fontFamily: "'Jost', sans-serif" },
  amountText:  { fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#2d1f17' },

  detail:      { borderTop: '1px solid #f0e8e2', padding: '18px 22px', background: '#fdf9f7' },
  detailGrid:  { display: 'flex', flexDirection: 'column', gap: 10 },
  detailRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', color: '#c9aa9e' },
  detailValue: { fontSize: 13, color: '#5a4038' },

  primaryBtn:  { padding: '13px 30px', background: 'linear-gradient(135deg, #D4714E, #b85535)',
                 color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600,
                 fontFamily: "'Jost', sans-serif", cursor: 'pointer' },
};
