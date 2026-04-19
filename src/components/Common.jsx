import React from 'react';

export const C = {
  bg: '#000000', 
  surface: '#000000',
  border: 'rgba(255, 255, 255, 0.2)',
  text: '#ffffff',
  muted: '#888888',
  accent: '#ffffff',
  success: '#ffffff',
  warning: '#ffffff',
  danger: '#ef4444',
  shadow: 'none',
  shadowLg: 'none',
};

export const Logo = ({ size = 'md' }) => {
  const fs = { sm: 16, md: 24, lg: 32 }[size];
  return (
    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: fs, letterSpacing: '0.1em', userSelect: 'none', color: '#fff', display: 'flex', alignItems: 'center' }}>
      LITE<span style={{ color: '#fff', opacity: 0.7 }}>LAB</span>
    </span>
  );
};

export const Badge = ({ label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      padding: '8px 24px', 
      borderRadius: 99, 
      fontSize: 11, 
      fontWeight: 800, 
      textTransform: 'uppercase', 
      letterSpacing: '0.15em', 
      background: active ? '#fff' : 'transparent', 
      color: active ? '#000' : '#fff', 
      border: `1px solid #fff`,
      cursor: 'pointer',
      transition: 'all 0.3s'
    }}
  >
    {label}
  </button>
);

export const Card = ({ children, style: ex = {}, padding = '24px', className = '', onClick }) => (
  <div 
    className={`${className} hover-lift`} 
    onClick={onClick}
    style={{ 
      background: '#000', 
      borderRadius: 0, 
      border: `1px solid rgba(255,255,255,0.1)`, 
      padding, 
      ...ex 
    }}
  >
    {children}
  </div>
);

export const Avatar = ({ user, size = 40 }) => {
  if (!user) return <div style={{ width: size, height: size, borderRadius: '50%', border: '1px solid #fff', flexShrink: 0 }} />;
  const initial = (user.name || user.username || 'A')[0].toUpperCase();
  const dp = user.dp || user.photo;
  
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 800, border: `1px solid #fff`, overflow: 'hidden', flexShrink: 0 }}>
      {dp ? <img src={dp} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
    </div>
  );
};
