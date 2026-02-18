import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OwnerHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ properties: 0, bookings: 0, pending: 0 });
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${user.token}` };
    Promise.all([
      axios.get('http://localhost:5000/api/owner/properties', { headers }),
      axios.get('http://localhost:5000/api/owner/bookings', { headers }),
    ]).then(([pRes, bRes]) => {
      setStats({
        properties: pRes.data.length,
        bookings: bRes.data.length,
        pending: bRes.data.filter((b) => b.status === 'pending').length,
      });
    }).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('househuntUser');
    navigate('/login');
  };

  return (
    <div>
      <div className="sidebar">
        <div className="logo">HouseHunt Owner</div>
        <nav>
          <Link to="/owner" className="active">Dashboard</Link>
          <Link to="/owner/add-property">Add Property</Link>
          <Link to="/owner/properties">My Properties</Link>
          <Link to="/owner/bookings">Bookings</Link>
        </nav>
      </div>
      <div className="main-content">
        <div className="topbar">
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Owner Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--text-light)' }}>{user?.name}</span>
            <button onClick={handleLogout} className="btn" style={{ background: '#f1f5f9', fontSize: 13 }}>Logout</button>
          </div>
        </div>
        <div style={{ padding: '24px 0' }}>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-value">{stats.properties}</div><div className="stat-label">My Properties</div></div>
            <div className="stat-card"><div className="stat-value">{stats.bookings}</div><div className="stat-label">Total Bookings</div></div>
            <div className="stat-card"><div className="stat-value" style={{ color: '#f59e0b' }}>{stats.pending}</div><div className="stat-label">Pending Approval</div></div>
          </div>
          <div className="grid-2">
            <div className="card">
              <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/owner/add-property" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>+ Add New Property</Link>
                <Link to="/owner/properties" className="btn" style={{ background: '#f1f5f9', justifyContent: 'flex-start' }}>View My Properties</Link>
                <Link to="/owner/bookings" className="btn" style={{ background: '#f1f5f9', justifyContent: 'flex-start' }}>Manage Bookings</Link>
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Account Info</h3>
              <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.8 }}>
                Name: {user?.name}<br />
                Email: {user?.email}<br />
                Role: Property Owner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
