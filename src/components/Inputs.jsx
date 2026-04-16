import React, { useState } from 'react';
import { C } from './Common';
import Icon from './Icon';

export const Btn = ({ onClick, children, variant = 'primary', size = 'md', full = false, disabled = false, style: ex = {} }) => {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const sizes = { sm: { padding: '7px 14px', fontSize: 13 }, md: { padding: '10px 20px', fontSize: 14 }, lg: { padding: '13px 24px', fontSize: 15 } };
  const vars = {
    primary: { background: h ? '#be123c' : C.accent, color: '#fff' },
    secondary: { background: h ? '#e2e8f0' : C.border, color: C.text, border: `1px solid ${C.border}` },
    danger: { background: h ? '#be123c' : C.danger, color: '#fff' },
    ghost: { background: h ? C.accentLight : 'transparent', color: h ? C.accent : C.muted },
    success: { background: h ? '#16a34a' : C.success, color: '#fff' },
  };
  return (
    <button 
      onClick={disabled ? undefined : onClick} 
      onMouseEnter={() => setH(true)} 
      onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      style={{ 
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
        transform: disabled ? 'none' : p ? 'scale(0.96)' : h ? 'scale(1.02)' : 'scale(1)',
        boxShadow: h && !disabled ? '0 10px 20px rgba(225,29,72,0.15)' : 'none',
        width: full ? '100%' : 'auto', opacity: disabled ? 0.6 : 1, ...sizes[size], ...vars[variant], ...ex 
      }}>
      {children}
    </button>
  );
};

export const Field = ({ label, type = 'text', placeholder, value, onChange, icon, required, maxLength, note, readOnly }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: 12, top: '50%', transform: `translateY(-50%) scale(${focused ? 1.1 : 1})`, transition: 'all 0.2s', pointerEvents: 'none' }}><Icon name={icon} size={15} color={focused ? C.accent : C.muted} /></div>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength} required={required} readOnly={readOnly}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: '100%', padding: icon ? '11px 14px 11px 40px' : '11px 14px', border: `1.5px solid ${focused ? C.accent : C.border}`, borderRadius: 10, fontSize: 14, color: readOnly ? C.muted : C.text, background: readOnly ? C.surface : focused ? '#fff' : C.surface, outline: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: focused ? `0 0 0 4px ${C.accent}12` : 'none', fontFamily: 'Inter, sans-serif' }} />
      </div>
      {note && <span style={{ fontSize: 12, color: C.muted }}>{note}</span>}
    </div>
  );
};
