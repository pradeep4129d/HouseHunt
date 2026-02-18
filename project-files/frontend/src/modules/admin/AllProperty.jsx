import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../common/Toast';

export default function AllProperty() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5000/api/admin/properties', {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setProperties(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/property/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProperties((prev) => prev.filter((p) => p._id !== id));
      setToast({ message: 'Property deleted', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Delete failed', type: 'error' });
    }
  };

  return (
    <div>
      <div className="sidebar">
        <div className="logo">HouseHunt Admin</div>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">All Users</Link>
          <Link to="/admin/properties" className="active">All Properties</Link>
          <Link to="/admin/bookings">All Bookings</Link>
        </nav>
      </div>
      <div className="main-content">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="topbar">
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>All Properties</h1>
          <span style={{ fontSize: 14, color: 'var(--text-light)' }}>{properties.length} total</span>
        </div>
        <div style={{ padding: '24px 0' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? <p style={{ padding: 20, color: 'var(--text-light)' }}>Loading...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Owner</th>
                    <th>City / State</th>
                    <th>Type</th>
                    <th>Rent/mo</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-light)', padding: 32 }}>No properties found</td></tr>
                  ) : properties.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 500 }}>{p.title}</td>
                      <td>{p.owner?.name}<br /><span style={{ fontSize: 12, color: 'var(--text-light)' }}>{p.owner?.email}</span></td>
                      <td>{p.city}, {p.state}</td>
                      <td style={{ textTransform: 'capitalize' }}>{p.propertyType}</td>
                      <td style={{ fontWeight: 600 }}>₹{p.rent?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${p.isAvailable ? 'badge-approved' : 'badge-rejected'}`}>
                          {p.isAvailable ? 'Available' : 'Rented'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleDelete(p._id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }}>
                          Delete
                        </button>
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
