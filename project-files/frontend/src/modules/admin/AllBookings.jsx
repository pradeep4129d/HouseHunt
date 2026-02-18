import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../common/Toast';

export default function AllBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5000/api/admin/bookings', {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="sidebar">
        <div className="logo">HouseHunt Admin</div>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">All Users</Link>
          <Link to="/admin/properties">All Properties</Link>
          <Link to="/admin/bookings" className="active">All Bookings</Link>
        </nav>
      </div>
      <div className="main-content">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="topbar">
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>All Bookings</h1>
        </div>
        <div style={{ padding: '24px 0' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? <p style={{ padding: 20, color: 'var(--text-light)' }}>Loading...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Renter</th>
                    <th>Owner</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-light)', padding: 32 }}>No bookings found</td></tr>
                  ) : bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.property?.title || 'N/A'}<br /><span style={{ fontSize: 12, color: 'var(--text-light)' }}>{b.property?.city}</span></td>
                      <td>{b.renter?.name}<br /><span style={{ fontSize: 12, color: 'var(--text-light)' }}>{b.renter?.email}</span></td>
                      <td>{b.owner?.name}<br /><span style={{ fontSize: 12, color: 'var(--text-light)' }}>{b.owner?.email}</span></td>
                      <td>{new Date(b.startDate).toLocaleDateString()}</td>
                      <td>{new Date(b.endDate).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 600 }}>₹{b.totalAmount?.toLocaleString()}</td>
                      <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
