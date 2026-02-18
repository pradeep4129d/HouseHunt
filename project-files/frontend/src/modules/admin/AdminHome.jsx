import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sidebar = () => (
  <div className="sidebar">
    <div className="logo">HouseHunt Admin</div>
    <nav>
      <Link to="/admin" className="active">Dashboard</Link>
      <Link to="/admin/users">All Users</Link>
      <Link to="/admin/properties">All Properties</Link>
      <Link to="/admin/bookings">All Bookings</Link>
    </nav>
  </div>
);

export default function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setStats(data)).catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('househuntUser');
    navigate('/login');
  };

  return (
    <div>
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--text-light)' }}>Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="btn" style={{ background: '#f1f5f9', fontSize: 13 }}>Logout</button>
          </div>
        </div>

        <div style={{ padding: '24px 0' }}>
          <div className="stats-grid">
            {stats ? (
              <>
                <div className="stat-card"><div className="stat-value">{stats.totalUsers}</div><div className="stat-label">Total Users</div></div>
                <div className="stat-card"><div className="stat-value">{stats.totalOwners}</div><div className="stat-label">Owners</div></div>
                <div className="stat-card"><div className="stat-value">{stats.totalRenters}</div><div className="stat-label">Renters</div></div>
                <div className="stat-card"><div className="stat-value">{stats.totalProperties}</div><div className="stat-label">Total Properties</div></div>
                <div className="stat-card"><div className="stat-value">{stats.availableProperties}</div><div className="stat-label">Available</div></div>
                <div className="stat-card"><div className="stat-value">{stats.totalBookings}</div><div className="stat-label">Total Bookings</div></div>
                <div className="stat-card"><div className="stat-value">{stats.pendingBookings}</div><div className="stat-label">Pending</div></div>
                <div className="stat-card"><div className="stat-value">{stats.approvedBookings}</div><div className="stat-label">Approved</div></div>
              </>
            ) : (
              <p style={{ color: 'var(--text-light)' }}>Loading stats...</p>
            )}
          </div>

          <div className="grid-2" style={{ gap: 20 }}>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/admin/users" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>Manage Users</Link>
                <Link to="/admin/properties" className="btn" style={{ background: '#f1f5f9', justifyContent: 'flex-start' }}>Manage Properties</Link>
                <Link to="/admin/bookings" className="btn" style={{ background: '#f1f5f9', justifyContent: 'flex-start' }}>View All Bookings</Link>
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontWeight: 600 }}>System Info</h3>
              <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.8 }}>
                Platform: HouseHunt v1.0<br />
                Role: Administrator<br />
                Email: {user?.email}<br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
