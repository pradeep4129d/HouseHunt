import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../common/Toast';

export default function AddProperty() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', address: '', city: '', state: '',
    rent: '', bedrooms: 1, bathrooms: 1, area: '',
    propertyType: 'apartment', amenities: '',
  });
  const [images, setImages] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('househuntUser') || 'null');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => formData.append('images', img));
      await axios.post('http://localhost:5000/api/owner/property', formData, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' },
      });
      setToast({ message: 'Property added successfully!', type: 'success' });
      setTimeout(() => navigate('/owner/properties'), 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to add property', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="sidebar">
        <div className="logo">HouseRent Owner</div>
        <nav>
          <Link to="/owner">Dashboard</Link>
          <Link to="/owner/add-property" className="active">Add Property</Link>
          <Link to="/owner/properties">My Properties</Link>
          <Link to="/owner/bookings">Bookings</Link>
        </nav>
      </div>
      <div className="main-content">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="topbar">
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Add New Property</h1>
        </div>
        <div style={{ padding: '24px 0', maxWidth: 700 }}>
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Property Title</label>
                <input name="title" placeholder="e.g. Spacious 2BHK Apartment" value={form.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows={3} placeholder="Describe your property..." value={form.description} onChange={handleChange} required style={{ resize: 'vertical' }} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" placeholder="Maharashtra" value={form.state} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <input name="address" placeholder="Street, Area, Landmark" value={form.address} onChange={handleChange} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Monthly Rent (₹)</label>
                  <input type="number" name="rent" placeholder="15000" value={form.rent} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Property Type</label>
                  <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                    <option value="pg">PG</option>
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input type="number" name="bedrooms" min={0} value={form.bedrooms} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input type="number" name="bathrooms" min={1} value={form.bathrooms} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Area (sq ft)</label>
                <input type="number" name="area" placeholder="800" value={form.area} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Amenities (comma separated)</label>
                <input name="amenities" placeholder="WiFi, Parking, AC, Gym" value={form.amenities} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Property Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} />
                {images.length > 0 && <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>{images.length} image(s) selected</p>}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Property'}
                </button>
                <Link to="/owner/properties" className="btn" style={{ background: '#f1f5f9' }}>Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
