import React from 'react';

export const C = {
  bg: '#000000', 
  surface: '#000000',
  border: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  muted: '#888888',
  accent: '#ffffff',
  success: '#ffffff',
  warning: '#ffffff',
  danger: '#ff4444',
  shadow: 'none',
  shadowLg: 'none',
};

export const Logo = ({ size = 'md', stacked = false }) => {
  const fs = { sm: 14, md: 20, lg: 32 }[size];
  return (
    <span style={{ 
      fontFamily: 'Outfit, sans-serif', 
      fontWeight: 900, 
      fontSize: fs, 
      letterSpacing: '0.15em', 
      userSelect: 'none', 
      color: '#fff', 
      display: stacked ? 'flex' : 'inline-flex',
      flexDirection: stacked ? 'column' : 'row',
      alignItems: 'center',
      textTransform: 'uppercase',
      lineHeight: stacked ? 1.1 : 1
    }}>
      LITERIGHT {stacked && <br />} <span style={{ opacity: 0.5, marginLeft: stacked ? 0 : '0.3em' }}>ACADEMY</span>
    </span>
  );
};

export const Badge = ({ label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      padding: '6px 20px', 
      borderRadius: 1, 
      fontSize: 10, 
      fontWeight: 900, 
      textTransform: 'uppercase', 
      letterSpacing: '0.2em', 
      background: active ? '#fff' : 'transparent', 
      color: active ? '#000' : '#fff', 
      border: `1px solid rgba(255,255,255, ${active ? 1 : 0.2})`,
      cursor: 'pointer',
      transition: 'all 0.3s'
    }}
  >
    {label}
  </button>
);

export const Card = ({ children, style: ex = {}, padding = '24px', className = '', onClick, glass = false }) => (
  <div 
    className={`${className} ${glass ? 'glass' : ''}`} 
    onClick={onClick}
    style={{ 
      background: glass ? 'rgba(255,255,255,0.03)' : '#000', 
      backdropFilter: glass ? 'blur(10px)' : 'none',
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
