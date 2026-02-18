import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('househuntUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleDashboard = () => {
    if (!user) return navigate('/login');
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'owner') navigate('/owner');
    else navigate('/renter');
  };

  const handleLogout = () => {
    localStorage.removeItem('househuntUser');
    setUser(null);
  };

  return (
    <div>
      <nav className="navbar">
        <span className="logo">HouseHunt</span>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: '#94a3b8', fontSize: 14, marginRight: 16 }}>
                Hi, {user.name}
              </span>
              <button onClick={handleDashboard} className="btn btn-primary" style={{ marginRight: 8 }}>
                Dashboard
              </button>
              <button onClick={handleLogout} className="btn" style={{ background: '#334155', color: '#fff' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#94a3b8', marginLeft: 24, fontSize: 14, fontWeight: 500 }}>Login</Link>
              <Link to="/register" style={{ color: '#94a3b8', marginLeft: 24, fontSize: 14, fontWeight: 500 }}>Register</Link>
            </>
          )}
        </nav>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #2563eb 100%)', color: '#fff', padding: '80px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16 }}>Find Your Perfect Home</h1>
        <p style={{ fontSize: 18, color: '#cbd5e1', marginBottom: 32 }}>Browse thousands of rental properties across the country</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 16 }}>Get Started</Link>
          <button onClick={() => navigate('/renter/properties')} className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '12px 28px', fontSize: 16 }}>
            Browse Properties
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="container" style={{ padding: '64px 16px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 48 }}>Why Choose HouseHunt?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
          {[
            { icon: '🏠', title: 'Wide Selection', desc: 'Thousands of verified properties for every budget' },
            { icon: '🔒', title: 'Secure Bookings', desc: 'Safe and transparent booking process' },
            { icon: '⚡', title: 'Fast Response', desc: 'Get approval from owners within 24 hours' },
            { icon: '💳', title: 'Easy Payments', desc: 'Hassle-free rent payment system' },
          ].map((f) => (
            <div key={f.title} className="card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-light)', fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
