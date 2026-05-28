import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .vu-root {
    min-height: 100vh;
    background: #fdf6f0;
    padding: 48px 32px;
    font-family: 'Jost', sans-serif;
    position: relative;
    overflow-x: hidden;
  }

  .vu-blob {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(90px);
    opacity: 0.3;
    z-index: 0;
  }
  .vu-blob-1 { width: 500px; height: 500px; top: -160px; right: -160px; background: #f5c9b3; }
  .vu-blob-2 { width: 400px; height: 400px; bottom: -120px; left: -120px; background: #e8d5c4; }

  .vu-inner {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* ── Header ── */
  .vu-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 36px;
    animation: vu-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes vu-rise {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .vu-title-group {}

  .vu-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #D4714E;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .vu-eyebrow::before {
    content: '';
    display: inline-block;
    width: 18px; height: 1.5px;
    background: #D4714E;
  }

  .vu-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 600;
    color: #2a1810;
    line-height: 1;
    letter-spacing: -0.5px;
  }

  .vu-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    background: linear-gradient(135deg, #D4714E, #c05535);
    color: #fff;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 16px rgba(212,113,78,0.35);
  }

  /* ── Card wrapper ── */
  .vu-card {
    background: #fff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow:
      0 2px 0 rgba(212,113,78,0.12),
      0 20px 60px rgba(180,100,60,0.09),
      0 4px 16px rgba(0,0,0,0.04);
    animation: vu-rise 0.55s 0.08s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* ── Accent bar ── */
  .vu-accent {
    height: 4px;
    background: linear-gradient(90deg, #D4714E, #e8956e, #D4714E);
    background-size: 200% 100%;
    animation: vu-shimmer 3s ease infinite;
  }

  @keyframes vu-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Table ── */
  .vu-table-wrap { overflow-x: auto; }

  table.vu-table {
    width: 100%;
    border-collapse: collapse;
  }

  .vu-table thead tr {
    background: #fdf8f6;
    border-bottom: 1.5px solid #eaddd6;
  }

  .vu-table thead th {
    padding: 16px 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #9b7b6a;
    text-align: left;
    white-space: nowrap;
  }

  .vu-table thead th:first-child { padding-left: 28px; }
  .vu-table thead th:last-child  { padding-right: 28px; text-align: right; }

  .vu-table tbody tr {
    border-bottom: 1px solid #f3ebe5;
    transition: background 0.15s;
    animation: vu-row-in 0.35s ease both;
  }

  @keyframes vu-row-in {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .vu-table tbody tr:nth-child(1) { animation-delay: 0.10s; }
  .vu-table tbody tr:nth-child(2) { animation-delay: 0.15s; }
  .vu-table tbody tr:nth-child(3) { animation-delay: 0.20s; }
  .vu-table tbody tr:nth-child(4) { animation-delay: 0.25s; }
  .vu-table tbody tr:nth-child(5) { animation-delay: 0.30s; }
  .vu-table tbody tr:nth-child(6) { animation-delay: 0.35s; }

  .vu-table tbody tr:hover { background: #fef7f3; }
  .vu-table tbody tr:last-child { border-bottom: none; }

  .vu-table tbody td {
    padding: 16px 20px;
    font-size: 14px;
    color: #3d2b22;
    font-weight: 400;
    vertical-align: middle;
  }

  .vu-table tbody td:first-child { padding-left: 28px; }
  .vu-table tbody td:last-child  { padding-right: 28px; text-align: right; }

  /* Serial number pill */
  .vu-serial {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px; height: 28px;
    border-radius: 8px;
    background: #fdf0ea;
    color: #D4714E;
    font-size: 12px;
    font-weight: 600;
  }

  /* Avatar + name */
  .vu-name-cell {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .vu-avatar {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #D4714E, #e8956e);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
    font-family: 'Cormorant Garamond', serif;
  }

  .vu-name-text {
    font-weight: 500;
    color: #2a1810;
  }

  /* Email / phone chips */
  .vu-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 6px;
    background: #fdf0ea;
    color: #7a4530;
    font-size: 13px;
  }

  .vu-chip svg { opacity: 0.6; flex-shrink: 0; }

  /* Address */
  .vu-address {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #9b7b6a;
    font-size: 13px;
  }

  /* Action buttons */
  .vu-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  .vu-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Jost', sans-serif;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    transition: transform 0.13s, box-shadow 0.15s, background 0.15s;
    border: none;
  }

  .vu-btn-edit {
    background: #fdf0ea;
    color: #D4714E;
    border: 1.5px solid #f0c4ae;
  }

  .vu-btn-edit:hover {
    background: #D4714E;
    color: #fff;
    border-color: #D4714E;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(212,113,78,0.35);
  }

  .vu-btn-delete {
    background: #fdf0f0;
    color: #c03030;
    border: 1.5px solid #f0c4c4;
  }

  .vu-btn-delete:hover {
    background: #c03030;
    color: #fff;
    border-color: #c03030;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(192,48,48,0.3);
  }

  /* Empty state */
  .vu-empty {
    padding: 64px 0;
    text-align: center;
    color: #c8b0a6;
  }

  .vu-empty-icon {
    width: 56px; height: 56px;
    margin: 0 auto 16px;
    background: #fdf0ea;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #D4714E;
    opacity: 0.6;
  }

  .vu-empty p { font-size: 15px; }

  /* Loading shimmer rows */
  .vu-shimmer-row td { padding: 18px 20px; }
  .vu-shimmer-row td:first-child { padding-left: 28px; }

  .vu-shimmer-bar {
    height: 14px;
    border-radius: 6px;
    background: linear-gradient(90deg, #f3ebe5 25%, #fdf0ea 50%, #f3ebe5 75%);
    background-size: 200% 100%;
    animation: vu-shimmer-anim 1.4s ease infinite;
  }

  @keyframes vu-shimmer-anim {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Confirm overlay */
  .vu-overlay {
    position: fixed;
    inset: 0;
    background: rgba(42,24,16,0.45);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: vu-fade 0.2s ease both;
  }

  @keyframes vu-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .vu-dialog {
    background: #fff;
    border-radius: 20px;
    padding: 36px 32px;
    width: 100%;
    max-width: 360px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    animation: vu-pop 0.25s cubic-bezier(0.22,1,0.36,1) both;
    text-align: center;
  }

  @keyframes vu-pop {
    from { opacity: 0; transform: scale(0.92) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .vu-dialog-icon {
    width: 52px; height: 52px;
    background: #fff0f0;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c03030;
    margin: 0 auto 16px;
  }

  .vu-dialog h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 600;
    color: #2a1810;
    margin-bottom: 8px;
  }

  .vu-dialog p {
    font-size: 14px;
    color: #9b7b6a;
    line-height: 1.5;
    margin-bottom: 24px;
  }

  .vu-dialog-actions {
    display: flex;
    gap: 10px;
  }

  .vu-dialog-cancel {
    flex: 1;
    padding: 12px;
    border: 1.5px solid #eaddd6;
    border-radius: 12px;
    background: #fdf8f6;
    color: #9b7b6a;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .vu-dialog-cancel:hover { border-color: #D4714E; color: #D4714E; }

  .vu-dialog-confirm {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #c03030, #a02020);
    color: #fff;
    font-family: 'Jost', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(192,48,48,0.3);
    transition: transform 0.13s, box-shadow 0.15s;
  }

  .vu-dialog-confirm:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(192,48,48,0.4);
  }

  /* Toast */
  .vu-toast {
    position: fixed;
    bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(16px);
    padding: 12px 22px;
    border-radius: 50px;
    font-size: 14px;
    font-family: 'Jost', sans-serif;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
    z-index: 200;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.14);
  }

  .vu-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  .vu-toast.success { background: #0f3320; color: #b8f0d0; }
  .vu-toast.error   { background: #3d1010; color: #ffcdc8; }

  @media (max-width: 700px) {
    .vu-root { padding: 28px 12px; }
    .vu-title { font-size: 32px; }
    .vu-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    .vu-address { max-width: 100px; }
  }
`;

const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconEdit = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconMail = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconPhone = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
  </svg>
);

const IconPin = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconWarnBig = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const IconEmpty = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

export default function ViewUser() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [confirm, setConfirm]     = useState(null); // uid to delete
  const [toast, setToast]         = useState({ msg: '', type: '', show: false });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    axios.get("http://localhost:7000/user/getUsers")
      .then((res) => setUsers(res.data.alluser || []))
      .catch((err) => { console.log(err); showToast('Failed to load users.', 'error'); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (uid) => {
    axios.delete(`http://localhost:7000/user/deleteuserbyid/${uid}`)
      .then(() => {
        setUsers(prev => prev.filter(u => u._id !== uid));
        showToast('User deleted successfully.', 'success');
      })
      .catch((err) => {
        console.log(err);
        showToast('Failed to delete user.', 'error');
      })
      .finally(() => setConfirm(null));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="vu-root">
        <div className="vu-blob vu-blob-1" />
        <div className="vu-blob vu-blob-2" />

        <div className="vu-inner">

          {/* Header */}
          <div className="vu-header">
            <div className="vu-title-group">
              <p className="vu-eyebrow">CraftNest Admin</p>
              <h1 className="vu-title">User Directory</h1>
            </div>
            <div className="vu-count-badge">
              <IconUsers />
              {loading ? '...' : `${users.length} user${users.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          {/* Table card */}
          <div className="vu-card">
            <div className="vu-accent" />
            <div className="vu-table-wrap">
              <table className="vu-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    // Shimmer rows
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="vu-shimmer-row">
                        <td><div className="vu-shimmer-bar" style={{ width: 28 }} /></td>
                        <td><div className="vu-shimmer-bar" style={{ width: 130 }} /></td>
                        <td><div className="vu-shimmer-bar" style={{ width: 160 }} /></td>
                        <td><div className="vu-shimmer-bar" style={{ width: 100 }} /></td>
                        <td><div className="vu-shimmer-bar" style={{ width: 120 }} /></td>
                        <td><div className="vu-shimmer-bar" style={{ width: 140, marginLeft: 'auto' }} /></td>
                      </tr>
                    ))
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="vu-empty">
                          <div className="vu-empty-icon"><IconEmpty /></div>
                          <p>No users found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((row, index) => (
                      <tr key={row._id}>
                        <td><span className="vu-serial">{index + 1}</span></td>
                        <td>
                          <div className="vu-name-cell">
                            <div className="vu-avatar">{getInitials(row.name)}</div>
                            <span className="vu-name-text">{row.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="vu-chip">
                            <IconMail />{row.email}
                          </span>
                        </td>
                        <td>
                          <span className="vu-chip">
                            <IconPhone />{row.phone}
                          </span>
                        </td>
                        <td>
                          <span className="vu-address" title={row.address}>
                            <IconPin style={{display:'inline',marginRight:4,verticalAlign:'middle',opacity:0.5}} />
                            {row.address}
                          </span>
                        </td>
                        <td>
                          <div className="vu-actions">
                            <Link
                              className="vu-btn vu-btn-edit"
                              to={`/Admin/UpdateUser/${row._id}`}
                            >
                              <IconEdit /> Update
                            </Link>
                            <button
                              className="vu-btn vu-btn-delete"
                              onClick={() => setConfirm(row._id)}
                            >
                              <IconTrash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Confirm dialog */}
        {confirm && (
          <div className="vu-overlay" onClick={() => setConfirm(null)}>
            <div className="vu-dialog" onClick={e => e.stopPropagation()}>
              <div className="vu-dialog-icon"><IconWarnBig /></div>
              <h3>Delete User?</h3>
              <p>This action cannot be undone. The user will be permanently removed from the system.</p>
              <div className="vu-dialog-actions">
                <button className="vu-dialog-cancel" onClick={() => setConfirm(null)}>Cancel</button>
                <button className="vu-dialog-confirm" onClick={() => handleDelete(confirm)}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        <div className={`vu-toast ${toast.type} ${toast.show ? 'show' : ''}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      </div>
    </>
  );
}
