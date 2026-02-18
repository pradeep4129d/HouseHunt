import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Toast from './Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/user/forgot-password', { email });
      setSent(true);
      setToast({ message: 'Reset instructions sent to your email!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Something went wrong', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8, fontWeight: 700 }}>Forgot Password</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: 14, marginBottom: 24 }}>
          Enter your email to receive reset instructions
        </p>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <p style={{ color: 'var(--text-light)', marginBottom: 20 }}>
              Check your email for password reset instructions.
            </p>
            <Link to="/login" className="btn btn-primary">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-light)' }}>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
