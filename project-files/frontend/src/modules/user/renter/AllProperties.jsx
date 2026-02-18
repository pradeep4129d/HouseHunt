import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../common/Toast';
import AllPropertiesCards from './AllPropertiesCards';

export default function RenterAllProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ city: '', type: '', minRent: '', maxRent: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({ startDate: '', endDate: '', message: '' });
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await axios.get('http://localhost:5000/api/user/properties', { params });
      setProperties(data);
    } catch {
      setToast({ message: 'Failed to load properties', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      await axios.post(`http://localhost:5000/api/user/book/${bookingModal._id}`, bookingForm, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setToast({ message: 'Booking request sent!', type: 'success' });
      setBookingModal(null);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Booking failed', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('houserentUser');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <span className="logo">HouseRent</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/renter" style={{ color: '#94a3b8', fontSize: 14 }}>Dashboard</Link>
          {user ? (
            <button onClick={handleLogout} className="btn" style={{ background: '#334155', color: '#fff', fontSize: 13 }}>Logout</button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ fontSize: 13 }}>Login</Link>
          )}
        </div>
      </nav>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Booking Modal */}
      {bookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 440 }}>
            <h3 style={{ marginBottom: 4, fontWeight: 700 }}>Book Property</h3>
            <p style={{ color: 'var(--text-light)', fontSize: 14, marginBottom: 20 }}>{bookingModal.title}</p>
            <form onSubmit={handleBook}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={bookingForm.startDate} onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={bookingForm.endDate} onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Message (optional)</label>
                <textarea rows={3} placeholder="Any message to the owner..." value={bookingForm.message} onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} style={{ resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Send Request</button>
                <button type="button" className="btn" style={{ flex: 1, background: '#f1f5f9' }} onClick={() => setBookingModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '32px 16px' }}>
        <div className="page-header">
          <h2>Browse Properties</h2>
          <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{properties.length} properties found</span>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 24, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>City</label>
              <input placeholder="Search city..." value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Type</label>
              <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="pg">PG</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Min Rent</label>
              <input type="number" placeholder="0" value={filters.minRent} onChange={(e) => setFilters({ ...filters, minRent: e.target.value })} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Max Rent</label>
              <input type="number" placeholder="Any" value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })} />
            </div>
            <button onClick={fetchProperties} className="btn btn-primary">Search</button>
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: 48 }}>Loading properties...</p>
        ) : (
          <AllPropertiesCards properties={properties} onBook={(p) => setBookingModal(p)} />
        )}
      </div>
    </div>
  );
}
