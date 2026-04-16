import React from 'react';

export const C = {
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  text: '#0f172a',
  muted: '#64748b',
  accent: '#e11d48',
  accentLight: '#fff1f2',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#dc2626',
};

export const Logo = ({ size = 'md' }) => {
  const fs = { sm: 16, md: 20, lg: 28 }[size];
  return (
    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: fs, letterSpacing: '-0.02em', userSelect: 'none', color: '#0f172a' }}>
      LITE<span style={{ color: C.accent }}>RIGHT</span>
      <span style={{ fontSize: fs * 0.55, marginLeft: 6, fontWeight: 500, color: '#94a3b8' }}>ACADEMY</span>
    </span>
  );
};

export const Badge = ({ label, color = C.accent }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: color + '18', color, border: `1px solid ${color}30` }}>
    {label}
  </span>
);

export const Card = ({ children, style: ex = {}, padding = '24px' }) => (
  <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(15,23,42,0.04)', padding, transition: 'all 0.3s ease', ...ex }}>
    {children}
  </div>
);

export const Avatar = ({ user, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: C.accentLight, color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 800, border: `2px solid #fff`, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
    {user.photo ? <img src={user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.username || user.name || 'A')[0].toUpperCase()}
  </div>
);
