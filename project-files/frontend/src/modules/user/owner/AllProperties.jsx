import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../common/Toast';

export default function OwnerAllProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5000/api/owner/properties', {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setProperties(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/owner/property/${id}`, {
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
        <div className="logo">HouseHunt Owner</div>
        <nav>
          <Link to="/owner">Dashboard</Link>
          <Link to="/owner/add-property">Add Property</Link>
          <Link to="/owner/properties" className="active">My Properties</Link>
          <Link to="/owner/bookings">Bookings</Link>
        </nav>
      </div>
      <div className="main-content">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="topbar">
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>My Properties</h1>
          <Link to="/owner/add-property" className="btn btn-primary" style={{ fontSize: 13 }}>+ Add Property</Link>
        </div>
        <div style={{ padding: '24px 0' }}>
          {loading ? <p style={{ color: 'var(--text-light)' }}>Loading...</p> : properties.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <p style={{ color: 'var(--text-light)', marginBottom: 16 }}>No properties yet</p>
              <Link to="/owner/add-property" className="btn btn-primary">Add Your First Property</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {properties.map((p) => (
                <div key={p._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {p.images.length > 0 ? (
                    <img src={`http://localhost:5000/uploads/${p.images[0]}`} alt={p.title}
                      style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: 180, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>No Image</div>
                  )}
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontWeight: 600, fontSize: 15 }}>{p.title}</h3>
                      <span className={`badge ${p.isAvailable ? 'badge-approved' : 'badge-rejected'}`}>
                        {p.isAvailable ? 'Available' : 'Rented'}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 8 }}>{p.address}, {p.city}</p>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 16, marginBottom: 12 }}>₹{p.rent?.toLocaleString()}/mo</p>
                    <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-light)', marginBottom: 14 }}>
                      <span>{p.bedrooms} Bed</span>
                      <span>•</span>
                      <span>{p.bathrooms} Bath</span>
                      <span>•</span>
                      <span style={{ textTransform: 'capitalize' }}>{p.propertyType}</span>
                    </div>
                    <button onClick={() => handleDelete(p._id)} className="btn btn-danger" style={{ width: '100%', padding: '8px', fontSize: 13 }}>
                      Delete Property
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
