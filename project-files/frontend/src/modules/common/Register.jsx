import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from './Toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'renter', phone: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/user/register', form);
      localStorage.setItem('househuntUser', JSON.stringify(data));
      setToast({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => {
        if (data.role === 'owner') navigate('/owner');
        else navigate('/renter');
      }, 800);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Registration failed', type: 'error' });
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
          <Link to="/login" className="btn" style={{ background: '#334155', color: '#fff', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 6 }}>Login</Link>
          <Link to="/register" className="btn" style={{ background: 'var(--primary)', color: '#fff', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 6 }}>Register</Link>
        </div>
      </nav>

      {/* Form centered below navbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 460 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, fontWeight: 700 }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: 14, marginBottom: 24 }}>
          Join HouseHunt today
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Register as</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="renter">Renter (Looking for property)</option>
              <option value="owner">Owner (Have property to rent)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-light)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
