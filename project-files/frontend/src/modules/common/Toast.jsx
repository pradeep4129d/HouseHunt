import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: { bg: '#dcfce7', border: '#22c55e', color: '#166534' },
    error:   { bg: '#fee2e2', border: '#ef4444', color: '#991b1b' },
    info:    { bg: '#dbeafe', border: '#3b82f6', color: '#1e40af' },
  };

  const style = colors[type] || colors.info;

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: style.bg, border: `1px solid ${style.border}`,
      color: style.color, padding: '12px 20px', borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxWidth: 360,
      display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500,
    }}>
      <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', cursor: 'pointer', color: style.color, fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}
