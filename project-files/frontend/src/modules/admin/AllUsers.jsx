import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../common/Toast';

export default function AllUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(({ data }) => setUsers(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setToast({ message: 'User deleted', type: 'success' });
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
          <Link to="/admin/users" className="active">All Users</Link>
          <Link to="/admin/properties">All Properties</Link>
          <Link to="/admin/bookings">All Bookings</Link>
        </nav>
      </div>
      <div className="main-content">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="topbar">
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>All Users</h1>
          <span style={{ fontSize: 14, color: 'var(--text-light)' }}>{users.length} users</span>
        </div>
        <div style={{ padding: '24px 0' }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? <p style={{ padding: 20, color: 'var(--text-light)' }}>Loading...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-light)', padding: 32 }}>No users found</td></tr>
                  ) : users.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '—'}</td>
                      <td>
                        <span className={`badge ${u.role === 'owner' ? 'badge-approved' : 'badge-pending'}`} style={{ textTransform: 'capitalize' }}>
                          {u.role}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleDelete(u._id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12 }}>
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
