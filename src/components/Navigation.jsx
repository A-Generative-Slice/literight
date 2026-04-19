import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C, Logo, Avatar } from './Common';
import Icon from './Icon';
import { Btn } from './Inputs';
import { useLmsStore } from '../stores/useLmsStore';

export const PublicNav = ({ onLoginClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [overlayActive, setOverlayActive] = useState(false);
  const [drop, setDrop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, logout, courses } = useLmsStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const q = searchQuery.toLowerCase().trim();
  const searchResults = [];
  if (q.length > 1 && courses) {
    courses.forEach(c => {
      if (c.title?.toLowerCase().includes(q)) {
        searchResults.push({ type: 'Course', id: c.id, title: c.title, icon: 'book', onClick: () => navigate(`/course/${c.id}`) });
      }
      c.chapters?.forEach(ch => {
        if (ch.title?.toLowerCase().includes(q)) {
          searchResults.push({ type: 'Module', id: c.id, title: ch.title, icon: 'folder', onClick: () => navigate(`/course/${c.id}`) });
        }
      });
    });
  }

  return (
    <div style={{ position: 'sticky', top: 20, zIndex: 1000, padding: '0 var(--container-px)', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <nav 
        className="glass reveal" 
        style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          height: 72, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 24px',
          borderRadius: 24,
          boxShadow: scrolled ? '0 20px 50px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)',
          transform: scrolled ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Logo />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button 
            onClick={() => setOverlayActive(true)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', width: 44, height: 44, borderRadius: 14, cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <Icon name="search" size={18} />
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <div onClick={() => setDrop(!drop)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '6px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Avatar user={user} size={36} />
                <Icon name="chevron-down" size={12} color="#64748b" />
              </div>
              {drop && (
                <div className="reveal" style={{ position: 'absolute', right: 0, top: 'calc(100% + 12px)', background: '#0f172a', borderRadius: 20, width: 240, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>{user.name || user.username}</div>
                    <div style={{ fontWeight: 500, fontSize: 11, color: '#64748b', marginTop: 2 }}>{user.username}</div>
                  </div>
                  <div style={{ padding: '8px' }}>
                    {user.role === 'admin' && <MenuItem icon="shield" label="Admin Panel" onClick={() => { setDrop(false); navigate('/admin'); }} />}
                    <MenuItem icon="user" label="My Profile" onClick={() => { setDrop(false); navigate('/profile'); }} />
                    <MenuItem icon="logout" label="Log Out" color="#ef4444" onClick={() => { setDrop(false); navigate('/'); logout(); }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Btn size="sm" onClick={onLoginClick} style={{ borderRadius: 12 }}>Join the Vanguard</Btn>
          )}
        </div>
      </nav>

      {/* Floating Action Search for Mobile Only */}
      <div className="md-block md-hidden" style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}>
        <div className="glass-floating" onClick={() => setOverlayActive(true)} style={{ width: 68, height: 68, background: 'var(--accent)', color: '#fff' }}>
          <Icon name="search" size={28} />
        </div>
      </div>

      {/* Modern Search Overlay */}
      {overlayActive && (
        <div className="search-overlay reveal">
          <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 48 }}>
              <button onClick={() => setOverlayActive(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8 }}>
                <Icon name="arrow-left" size={32} />
              </button>
              <div style={{ position: 'relative', flex: 1 }}>
                <input 
                  autoFocus
                  placeholder="What will you master today?" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255,255,255,0.1)', padding: '20px 0', color: '#fff', fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 800, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {searchResults.map((res, i) => (
                <div key={i} onClick={() => { res.onClick(); setOverlayActive(false); }} className="hover-lift" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                   <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(190, 18, 60, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
                     <Icon name={res.icon} size={24} />
                   </div>
                   <div>
                     <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{res.title}</div>
                     <div style={{ color: '#64748b', fontSize: 14, fontWeight: 600, marginTop: 4 }}>{res.type} Masterclass</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: color || '#f8fafc', textAlign: 'left', borderRadius: 12, transition: 'all 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    <Icon name={icon} size={15} color={color || '#64748b'} /> {label}
  </button>
);

