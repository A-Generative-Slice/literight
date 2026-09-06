import React from 'react';

export const C = {
  bg: '#ffffff', 
  surface: '#ffffff',
  border: 'rgba(0, 0, 0, 0.08)',
  text: '#0a0a0a',
  muted: '#64748b',
  accent: '#000000',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  shadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  shadowLg: '0 10px 30px rgba(0, 0, 0, 0.08)',
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
      color: '#000', 
      display: stacked ? 'flex' : 'inline-flex',
      flexDirection: stacked ? 'column' : 'row',
      alignItems: 'center',
      textTransform: 'uppercase',
      lineHeight: stacked ? 1.1 : 1
    }}>
      LITERIGHT {stacked && <br />} <span style={{ opacity: 0.45, marginLeft: stacked ? 0 : '0.3em' }}>ACADEMY</span>
    </span>
  );
};

export const Badge = ({ label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '12px 20px', 
      borderRadius: 1, 
      fontSize: 10, 
      fontWeight: 900, 
      textTransform: 'uppercase', 
      letterSpacing: '0.2em', 
      background: active ? '#000' : 'transparent', 
      color: active ? '#fff' : '#000', 
      border: `1px solid rgba(0, 0, 0, ${active ? 1 : 0.15})`,
      cursor: 'pointer',
      transition: 'all 0.3s',
      width: '100%',
      minHeight: 44
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
      background: glass ? 'rgba(255, 255, 255, 0.7)' : '#ffffff', 
      backdropFilter: glass ? 'blur(10px)' : 'none',
      borderRadius: 0, 
      border: `1px solid rgba(0, 0, 0, 0.08)`, 
      padding, 
      ...ex 
    }}
  >
    {children}
  </div>
);

export const Avatar = ({ user, size = 40 }) => {
  if (!user) return <div style={{ width: size, height: size, borderRadius: '50%', border: '1px solid #000', flexShrink: 0 }} />;
  const initial = (user.name || user.username || 'A')[0].toUpperCase();
  const dp = user.dp || user.photo;
  
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#ffffff', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.4, fontWeight: 800, border: `1px solid #000`, overflow: 'hidden', flexShrink: 0 }}>
      {dp ? <img src={dp} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initial}
    </div>
  );
};
