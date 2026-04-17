import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, Logo, Avatar } from './Common';
import Icon from './Icon';
import { Btn } from './Inputs';
import { useLmsStore } from '../stores/useLmsStore';

export const PublicNav = ({ onLoginClick }) => {
  const [drop, setDrop] = useState(false);
  const { user, logout } = useLmsStore();
  const role = user?.role;
  const navigate = useNavigate();

  return (
    <nav className="md-px-4" style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
      <div className="md-gap-4" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><Logo /></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <div onClick={() => setDrop(!drop)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 8 }}>
              <Avatar user={user} size={34} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>{user.username}</span>
              <Icon name="chevron-down" size={14} color={C.muted} />
            </div>
            {drop && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, width: 210, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 200, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{user.username}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{role === 'admin' ? 'Administrator' : 'Student'}</div>
                </div>
                {role === 'admin' && (
                  <MenuItem icon="shield" label="Admin Panel" onClick={() => { setDrop(false); navigate('/admin'); }} />
                )}
                <MenuItem icon="logout" label="Log Out" color={C.danger} onClick={() => { setDrop(false); navigate('/'); logout(); }} />
              </div>
            )}
          </div>
        ) : (
          <>
            <Btn variant="ghost" onClick={onLoginClick}>Log In</Btn>
            <Btn onClick={onLoginClick}>Get Started</Btn>
          </>
        )}
      </div>
    </nav>
  );
};

const MenuItem = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: color || C.text, fontFamily: 'Inter, sans-serif', textAlign: 'left' }}
    onMouseEnter={e => e.currentTarget.style.background = C.surface} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    <Icon name={icon} size={15} color={color || C.muted} /> {label}
  </button>
);
