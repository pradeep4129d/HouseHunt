import { useState } from 'react';

function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div style={{ height: 200, background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 48 }}>🏠</span>
      </div>
    );
  }

  const prev = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  };

  const next = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  };

  return (
    <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: '#e2e8f0' }}>
      {/* Main image */}
      <img
        src={`http://localhost:5000/uploads/${images[current]}`}
        alt={`image-${current}`}
        style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
      />

      {/* Arrows — only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button onClick={prev} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none',
            borderRadius: '50%', width: 30, height: 30, fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}>‹</button>
          <button onClick={next} style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none',
            borderRadius: '50%', width: 30, height: 30, fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            lineHeight: 1,
          }}>›</button>

          {/* Dot indicators */}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 5,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                style={{
                  width: i === current ? 18 : 7,
                  height: 7,
                  borderRadius: 999,
                  background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.2s, background 0.2s',
                }}
              />
            ))}
          </div>

          {/* Image counter */}
          <div style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.5)', color: '#fff',
            fontSize: 11, padding: '2px 8px', borderRadius: 999,
          }}>
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function AllPropertiesCards({ properties, onBook }) {
  if (properties.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-light)' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
        <p style={{ fontSize: 16 }}>No properties found matching your filters.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
      {properties.map((p) => (
        <div key={p._id} className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>

          {/* Image Carousel */}
          <ImageCarousel images={p.images} />

          <div style={{ padding: 16 }}>
            {/* Title & Type */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, flex: 1, marginRight: 8 }}>{p.title}</h3>
              <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                {p.propertyType}
              </span>
            </div>

            {/* Location */}
            <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 10 }}>
              📍 {p.address}, {p.city}, {p.state}
            </p>

            {/* Details */}
            <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text-light)', marginBottom: 12 }}>
              <span>🛏 {p.bedrooms} Bed</span>
              <span>🚿 {p.bathrooms} Bath</span>
              {p.area > 0 && <span>📐 {p.area} sqft</span>}
            </div>

            {/* Amenities */}
            {p.amenities?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {p.amenities.slice(0, 3).map((a) => (
                  <span key={a} style={{ background: '#f1f5f9', fontSize: 11, padding: '3px 8px', borderRadius: 4, color: 'var(--text-light)' }}>{a}</span>
                ))}
                {p.amenities.length > 3 && (
                  <span style={{ background: '#f1f5f9', fontSize: 11, padding: '3px 8px', borderRadius: 4, color: 'var(--text-light)' }}>+{p.amenities.length - 3} more</span>
                )}
              </div>
            )}

            {/* Rent & CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>₹{p.rent?.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: 'var(--text-light)' }}>/month</span>
              </div>
              <button onClick={() => onBook(p)} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
                Book Now
              </button>
            </div>

            {/* Owner */}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-light)' }}>
              Owner: {p.owner?.name} · {p.owner?.phone || p.owner?.email}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
