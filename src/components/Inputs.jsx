import React, { useState } from 'react';
import { C } from './Common';
import Icon from './Icon';

export const Btn = ({ onClick, children, variant = 'primary', size = 'md', full = false, disabled = false, style: ex = {} }) => {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const sizes = { 
    sm: { padding: 'clamp(6px, 2vw, 8px) clamp(12px, 4vw, 16px)', fontSize: 13 }, 
    md: { padding: 'clamp(8px, 3vw, 12px) clamp(16px, 5vw, 24px)', fontSize: 14 }, 
    lg: { padding: 'clamp(12px, 4vw, 16px) clamp(24px, 6vw, 32px)', fontSize: 15 } 
  };
  const vars = {
    primary: { background: h ? '#9f1239' : C.accent, color: '#fff', boxShadow: h ? '0 12px 24px -6px rgba(190,18,60,0.4)' : 'none' },
    secondary: { background: h ? '#f1f5f9' : '#fff', color: C.text, border: `1px solid ${C.border}`, boxShadow: h ? C.shadow : 'none' },
    danger: { background: h ? '#dc2626' : C.danger, color: '#fff' },
    ghost: { background: h ? 'rgba(15,23,42,0.05)' : 'transparent', color: h ? C.text : C.muted },
    success: { background: h ? '#059669' : C.success, color: '#fff' },
  };
  return (
    <button 
      onClick={disabled ? undefined : onClick} 
      onMouseEnter={() => setH(true)} 
      onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      style={{ 
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, border: 'none', borderRadius: 14, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, whiteSpace: 'nowrap',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
        transform: disabled ? 'none' : p ? 'scale(0.96)' : h ? 'scale(1.03) translateY(-1px)' : 'scale(1)',
        width: full ? '100%' : 'auto', opacity: disabled ? 0.6 : 1, ...sizes[size], ...vars[variant], ...ex 
      }}>
      {children}
    </button>
  );
};

export const Field = ({ label, type = 'text', placeholder, value, onChange, icon, required, maxLength, note, readOnly }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, marginLeft: 4 }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 14, top: '50%', transform: `translateY(-50%)`, transition: 'all 0.3s', pointerEvents: 'none' }}><Icon name={icon} size={16} color={focused ? C.accent : C.muted} /></div>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength} required={required} readOnly={readOnly}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', padding: icon ? '14px 16px 14px 44px' : '14px 16px', border: `1.5px solid ${focused ? C.accent : 'transparent'}`, borderRadius: 16, fontSize: 14, color: C.text, background: focused ? '#fff' : '#f1f5f9', outline: 'none', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: focused ? '0 0 0 4px rgba(190,18,60,0.08)' : 'none', fontFamily: 'Inter, sans-serif' }} />
      </div>
      {note && <span style={{ fontSize: 12, color: C.muted, marginLeft: 4 }}>{note}</span>}
    </div>
  );
};
