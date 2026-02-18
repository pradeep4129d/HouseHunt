import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../common/Toast';

export default function OwnerAllBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5000/api/owner/bookings', {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/owner/booking/${id}`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b));
      setToast({ message: `Booking ${status}`, type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Action failed', type: 'error' });
    }
  };

  return (
    <div>
      <div className="sidebar">
        <div className="logo">HouseHunt Owner</div>
        <nav>
          <Link to="/owner">Dashboard</Link>
          <Link to="/owner/add-property">Add Property</Link>
          <Link to="/owner/properties">My Properties</Link>
          <Link to="/owner/bookings" className="active">Bookings</Link>
        </nav>
      </div>
      <div className="main-content">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="topbar">
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Booking Requests</h1>
        </div>
        <div style={{ padding: '24px 0' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? <p style={{ padding: 20, color: 'var(--text-light)' }}>Loading...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Renter</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-light)', padding: 32 }}>No booking requests</td></tr>
                  ) : bookings.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 500 }}>{b.property?.title}<br /><span style={{ fontSize: 12, color: 'var(--text-light)' }}>{b.property?.city}</span></td>
                      <td>{b.renter?.name}<br /><span style={{ fontSize: 12, color: 'var(--text-light)' }}>{b.renter?.phone}</span></td>
                      <td style={{ fontSize: 13 }}>
                        {new Date(b.startDate).toLocaleDateString()} –<br />
                        {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{b.totalAmount?.toLocaleString()}</td>
                      <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                      <td>
                        {b.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleStatus(b._id, 'approved')} className="btn btn-success" style={{ padding: '5px 10px', fontSize: 12 }}>Approve</button>
                            <button onClick={() => handleStatus(b._id, 'rejected')} className="btn btn-danger" style={{ padding: '5px 10px', fontSize: 12 }}>Reject</button>
                          </div>
                        )}
                      </td>
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
