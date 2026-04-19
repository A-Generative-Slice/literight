import React from 'react';

export const C = {
  bg: '#f8fafc', 
  surface: 'rgba(255, 255, 255, 0.8)',
  border: 'rgba(226, 232, 240, 0.6)',
  text: '#0f172a',
  muted: '#64748b',
  accent: '#BE123C', // Deep Ruby
  accentGlow: 'rgba(190, 18, 60, 0.15)',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  shadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
  shadowLg: '0 20px 40px -15px rgba(0,0,0,0.15)',
};

export const Logo = ({ size = 'md' }) => {
  const fs = { sm: 16, md: 20, lg: 32 }[size];
  return (
    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: fs, letterSpacing: '-0.04em', userSelect: 'none', color: '#0f172a', display: 'flex', alignItems: 'center' }}>
      LITE<span style={{ color: C.accent }}>RIGHT</span>
      <span style={{ fontSize: fs * 0.45, marginLeft: 8, padding: '2px 6px', fontWeight: 800, color: '#fff', letterSpacing: '0.1em', background: C.text, borderRadius: 4 }}>ACADEMY</span>
    </span>
  );
};

export const Badge = ({ label, color = C.accent }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', background: color + '12', color, border: `1px solid ${color}20`, backdropFilter: 'blur(4px)' }}>
    {label}
  </span>
);

export const Card = ({ children, style: ex = {}, padding = '24px', className = '', glass = false }) => (
  <div className={className} style={{ 
    background: glass ? 'rgba(255,255,255,0.7)' : '#fff', 
    borderRadius: 24, 
    border: `1px solid ${C.border}`, 
    boxShadow: C.shadow, 
    padding, 
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    backdropFilter: glass ? 'blur(16px)' : 'none',
    ...ex 
  }}>
    {children}
  </div>
);

export const Avatar = ({ user, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: 16, background: '#f1f5f9', color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 800, border: `2px solid #fff`, boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)', overflow: 'hidden', flexShrink: 0 }}>
    {(user.dp || user.photo) ? <img src={user.dp || user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name || user.username || 'A')[0].toUpperCase()}
  </div>
);
