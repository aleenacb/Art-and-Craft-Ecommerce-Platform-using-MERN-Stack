import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  paid:    { bg: '#eaf3de', color: '#3b6d11', label: 'Paid' },
  pending: { bg: '#faeeda', color: '#854f0b', label: 'Pending' },
  unpaid:  { bg: '#fcebeb', color: '#a32d2d', label: 'Unpaid' },
  failed:  { bg: '#f5e5e5', color: '#7a1f1f', label: 'Failed' },
};

const METHOD_ICON = { upi: '📱', card: '💳', netbank: '🏦', cod: '📦' };

export default function AdminPayments() {
  const navigate = useNavigate();
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filterStatus, setFilter]       = useState('all');
  const [filterMethod, setMFilter]      = useState('all');
  const [search,       setSearch]       = useState('');
  const [toast,        setToast]        = useState('');
  const [updating,     setUpdating]     = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchBookings = () => {
    setLoading(true);
    axios.get('http://localhost:7000/booking/getAll')
      .then(res => setBookings(res.data.bookings || []))
      .catch(() => showToast('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    try {
      await axios.put(`http://localhost:7000/booking/updatePaymentStatus/${bookingId}`, {
        paymentStatus: newStatus,
      });
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, paymentStatus: newStatus } : b)
      );
      showToast(`Marked as ${newStatus}`);
    } catch {
      showToast('Update failed');
    } finally {
      setUpdating(null);
    }
  };

  const total   = bookings.length;
  const paid    = bookings.filter(b => b.paymentStatus === 'paid').length;
  const pending = bookings.filter(b => b.paymentStatus === 'pending').length;
  const revenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + Number(b.totalamount), 0);

  const filtered = bookings.filter(b => {
    const matchStatus = filterStatus === 'all' || b.paymentStatus === filterStatus;
    const matchMethod = filterMethod === 'all' || b.paymentInfo?.method === filterMethod;
    const matchSearch = !search ||
      b.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchMethod && matchSearch;
  });

  return (
    <div style={s.root}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      {toast && <div style={s.toast}>{toast}</div>}

      <header style={s.header}>
        <div style={s.logo}>● Artisan Admin</div>
        <button onClick={() => navigate(-1)} style={s.backBtn}>← Dashboard</button>
      </header>

      <div style={s.page}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={s.pageTitle}>Payment Management</h1>
          <p style={{ color: '#9b7b6a', margin: 0, fontSize: 14 }}>View, verify and update payment status for all bookings</p>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { label: 'Total Bookings', value: total,   color: '#2d1f17' },
            { label: 'Paid',           value: paid,    color: '#3b6d11' },
            { label: 'Pending',        value: pending, color: '#854f0b' },
            { label: 'Revenue',        value: `₹${revenue.toLocaleString('en-IN')}`, color: '#D4714E' },
          ].map(st => (
            <div key={st.label} style={s.statCard}>
              <p style={s.statLabel}>{st.label}</p>
              <p style={{ ...s.statValue, color: st.color }}>{st.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={s.filters}>
          <input
            type="text" placeholder="Search by name or email…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={s.searchInput}
          />
          <select value={filterStatus} onChange={e => setFilter(e.target.value)} style={s.select}>
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="unpaid">Unpaid</option>
            <option value="failed">Failed</option>
          </select>
          <select value={filterMethod} onChange={e => setMFilter(e.target.value)} style={s.select}>
            <option value="all">All methods</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="netbank">Net banking</option>
            <option value="cod">Cash on delivery</option>
          </select>
          <button onClick={fetchBookings} style={s.refreshBtn}>↻ Refresh</button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={s.emptyBox}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={s.emptyBox}>No bookings found.</div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Customer','Product','Method','UPI / Bank / Card','Amount','Status','Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => {
                  const statusStyle = STATUS_COLORS[b.paymentStatus] || STATUS_COLORS.pending;
                  const method = b.paymentInfo?.method || 'cod';
                  const detail =
                    method === 'upi'     ? `${b.paymentInfo?.upiApp || ''} · ${b.paymentInfo?.upiId || ''}` :
                    method === 'card'    ? `•••• ${(b.paymentInfo?.number || '').slice(-4)}` :
                    method === 'netbank' ? b.paymentInfo?.bank || '—' : 'On delivery';

                  return (
                    <tr key={b._id} style={{ background: i % 2 === 0 ? '#fff' : '#fdf9f7' }}>
                      <td style={s.td}>
                        <p style={{ margin: 0, fontWeight: 500, color: '#2d1f17', fontSize: 14 }}>{b.fullname}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#9b7b6a' }}>{b.email}</p>
                      </td>
                      <td style={s.td}>
                        <p style={{ margin: 0, fontSize: 13, color: '#2d1f17' }}>{b.productName || '—'}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#9b7b6a' }}>Qty: {b.quantity}</p>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontSize: 13 }}>{METHOD_ICON[method]} {method.toUpperCase()}</span>
                      </td>
                      <td style={{ ...s.td, fontSize: 12, color: '#7a5a4f', maxWidth: 160, wordBreak: 'break-all' }}>
                        {detail}
                      </td>
                      <td style={{ ...s.td, fontWeight: 600, color: '#D4714E' }}>
                        ₹{Number(b.totalamount).toLocaleString('en-IN')}
                      </td>
                      <td style={s.td}>
                        <span style={{
                          background: statusStyle.bg, color: statusStyle.color,
                          padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600,
                        }}>{statusStyle.label}</span>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {b.paymentStatus !== 'paid' && (
                            <button onClick={() => updateStatus(b._id, 'paid')} disabled={updating === b._id}
                              style={{ ...s.actionBtn, background: '#eaf3de', color: '#3b6d11', border: '1px solid #c0dd97' }}>
                              {updating === b._id ? '…' : '✓ Paid'}
                            </button>
                          )}
                          {b.paymentStatus !== 'pending' && (
                            <button onClick={() => updateStatus(b._id, 'pending')} disabled={updating === b._id}
                              style={{ ...s.actionBtn, background: '#faeeda', color: '#854f0b', border: '1px solid #fac775' }}>
                              Pending
                            </button>
                          )}
                          {b.paymentStatus !== 'failed' && (
                            <button onClick={() => updateStatus(b._id, 'failed')} disabled={updating === b._id}
                              style={{ ...s.actionBtn, background: '#fcebeb', color: '#a32d2d', border: '1px solid #f7c1c1' }}>
                              Failed
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  root: { minHeight: '100vh', background: '#f8f4f0', fontFamily: "'Jost', sans-serif" },
  toast: {
    position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
    background: '#2d1f17', color: '#fff', fontSize: 13, padding: '11px 28px', borderRadius: 50, zIndex: 9999,
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 40px', height: 68, background: '#2d1f17',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: '#fff' },
  backBtn: {
    background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 50, padding: '8px 20px', fontSize: 13, color: '#fff',
    cursor: 'pointer', fontFamily: "'Jost', sans-serif",
  },
  page: { maxWidth: 1200, margin: '0 auto', padding: '40px 32px' },
  pageTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 600, color: '#2d1f17', margin: '0 0 4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  statCard: { background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #eee5df' },
  statLabel: { fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', color: '#9b7b6a', margin: '0 0 8px' },
  statValue: { fontSize: 28, fontWeight: 600, margin: 0, fontFamily: "'Cormorant Garamond', serif" },
  filters: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  searchInput: {
    flex: 1, minWidth: 200, padding: '10px 16px',
    border: '1.5px solid #eaddd6', borderRadius: 50, fontSize: 14,
    fontFamily: "'Jost', sans-serif", color: '#2d1f17', background: '#fff', outline: 'none',
  },
  select: {
    padding: '10px 16px', border: '1.5px solid #eaddd6', borderRadius: 50,
    fontSize: 13, fontFamily: "'Jost', sans-serif", color: '#2d1f17', background: '#fff', cursor: 'pointer',
  },
  refreshBtn: {
    padding: '10px 20px', background: '#2d1f17', color: '#fff',
    border: 'none', borderRadius: 50, fontSize: 13, fontFamily: "'Jost', sans-serif", cursor: 'pointer',
  },
  tableWrap: { background: '#fff', borderRadius: 20, overflow: 'auto', border: '1px solid #eee5df' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: 860 },
  th: {
    textAlign: 'left', padding: '14px 16px', fontSize: 11, fontWeight: 600,
    letterSpacing: 1.5, textTransform: 'uppercase', color: '#9b7b6a',
    borderBottom: '1px solid #eee5df', background: '#fdf9f7',
  },
  td: { padding: '14px 16px', borderBottom: '1px solid #f4ede8', verticalAlign: 'middle' },
  actionBtn: {
    padding: '5px 12px', borderRadius: 50, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', fontFamily: "'Jost', sans-serif",
  },
  emptyBox: { textAlign: 'center', padding: '60px 20px', color: '#9b7b6a', background: '#fff', borderRadius: 20 },
};