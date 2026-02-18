import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../common/Toast';

export default function RenterHome() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5000/api/user/my-bookings', {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setBookings(data)).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('househuntUser');
    navigate('/login');
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await axios.put(`http://localhost:5000/api/user/cancel-booking/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      setToast({ message: 'Booking cancelled', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Cancel failed', type: 'error' });
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
  };

  return (
    <div>
      <nav className="navbar">
        <span className="logo">HouseRent</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/renter/properties" style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>Browse Properties</Link>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>{user?.name}</span>
          <button onClick={handleLogout} className="btn" style={{ background: '#334155', color: '#fff', fontSize: 13 }}>Logout</button>
        </div>
      </nav>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="container" style={{ padding: '32px 16px' }}>
        <div className="page-header">
          <h2>My Dashboard</h2>
          <Link to="/renter/properties" className="btn btn-primary">Browse Properties</Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total Bookings</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#f59e0b' }}>{stats.pending}</div><div className="stat-label">Pending</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#22c55e' }}>{stats.approved}</div><div className="stat-label">Approved</div></div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>My Bookings</div>
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-light)' }}>
                    No bookings yet. <Link to="/renter/properties" style={{ color: 'var(--primary)' }}>Browse properties</Link>
                  </td>
                </tr>
              ) : bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <strong>{b.property?.title}</strong><br />
                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{b.property?.city} • ₹{b.property?.rent?.toLocaleString()}/mo</span>
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {new Date(b.startDate).toLocaleDateString()} –<br />
                    {new Date(b.endDate).toLocaleDateString()}
                  </td>
                  <td style={{ fontWeight: 600 }}>₹{b.totalAmount?.toLocaleString()}</td>
                  <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'pending' && (
                      <button onClick={() => handleCancel(b._id)} className="btn btn-danger" style={{ padding: '5px 12px', fontSize: 12 }}>Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
