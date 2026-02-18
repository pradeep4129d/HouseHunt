import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from './Toast';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/user/login', form);
      localStorage.setItem('househuntUser', JSON.stringify(data));
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        if (data.role === 'admin') navigate('/admin');
        else if (data.role === 'owner') navigate('/owner');
        else navigate('/renter');
      }, 800);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo" style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>HouseHunt</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" className="btn" style={{ background: 'transparent', color: '#94a3b8', fontSize: 14, fontWeight: 500, padding: '8px 14px' }}>Home</Link>
          <Link to="/login" className="btn" style={{ background: 'var(--primary)', color: '#fff', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 6 }}>Login</Link>
          <Link to="/register" className="btn" style={{ background: '#334155', color: '#fff', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 6 }}>Register</Link>
        </div>
      </nav>

      {/* Form centered below navbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, fontWeight: 700 }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: 14, marginBottom: 24 }}>
          Login to your HouseHunt account
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: 13 }}>Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-light)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
