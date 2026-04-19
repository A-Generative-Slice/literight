import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C, Logo, Avatar } from './Common';
import Icon from './Icon';
import { Btn } from './Inputs';
import { useLmsStore } from '../stores/useLmsStore';

export const PublicNav = ({ onLoginClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [drop, setDrop] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const { user, logout, courses } = useLmsStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Search Logic
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
        ch.lessons?.forEach(l => {
          if (l.title?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q)) {
             searchResults.push({ type: 'Video', id: c.id, title: l.title, desc: l.description, icon: 'play', onClick: () => navigate(`/course/${c.id}?lessonId=${l.id}`) });
          }
        });
      });
    });
  }

  return (
    <nav className="glass md-px-4" style={{ padding: '0 var(--container-px)', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1, height: '100%' }}>
        {/* Logo - Hidden when search is active on mobile */}
        <div 
          onClick={() => navigate('/')} 
          className={mobileSearchActive ? 'md-hidden' : ''}
          style={{ cursor: 'pointer', transition: 'opacity 0.2s', flexShrink: 0 }}
        >
          <Logo />
        </div>
        
        {/* Omni Search Container */}
        <div style={{ 
          position: mobileSearchActive ? 'absolute' : 'relative', 
          inset: mobileSearchActive ? '0 16px' : 'auto',
          maxWidth: mobileSearchActive ? 'none' : 440, 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 10
        }}>
          {/* Mobile Back Button (only when search active) */}
          {mobileSearchActive && (
            <button 
              onClick={() => { setMobileSearchActive(false); setSearchQuery(''); }}
              style={{ background: 'none', border: 'none', color: C.muted, padding: '8px', cursor: 'pointer' }}
            >
              <Icon name="arrow-left" size={20} />
            </button>
          )}

          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <div 
              onClick={() => { if(!mobileSearchActive) setMobileSearchActive(true); }}
              style={{ position: 'absolute', left: 14, color: searchFocused ? C.accent : C.muted, transition: 'color 0.3s', cursor: 'pointer' }}
            >
              <Icon name="search" size={16} />
            </div>
            
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => { setSearchFocused(true); setMobileSearchActive(true); }}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className={!mobileSearchActive ? 'md-hidden' : ''}
              style={{ 
                width: '100%', 
                padding: '12px 18px 12px 42px', 
                borderRadius: 16, 
                border: 'none', 
                outline: 'none', 
                background: (searchFocused || mobileSearchActive) ? '#fff' : 'rgba(15, 23, 42, 0.05)', 
                fontSize: 14, 
                fontFamily: 'Inter, sans-serif', 
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
                boxShadow: searchFocused ? `0 0 0 4px rgba(190,18,60,0.08)` : 'none' 
              }}
            />

            {/* Hidden-on-desktop Trigger Stub for mobile (when not active) */}
            {!mobileSearchActive && (
               <div 
                  onClick={() => setMobileSearchActive(true)}
                  className="md-block md-hidden"
                  style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(15, 23, 42, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, cursor: 'pointer' }}
               >
                  <Icon name="search" size={18} />
               </div>
            )}
          </div>

          {searchFocused && searchQuery.length > 1 && (
            <div className="reveal" style={{ position: 'absolute', top: 'calc(100% + 12px)', left: -16, right: -16, background: '#fff', borderRadius: 20, boxShadow: C.shadowLg, overflow: 'hidden', padding: '12px 0', zIndex: 300, maxHeight: '80vh', overflowY: 'auto', border: `1px solid ${C.border}` }}>
              {searchResults.length === 0 ? (
                 <div style={{ padding: '24px', color: C.muted, fontSize: 13, textAlign: 'center', fontWeight: 500 }}>No results found for "{searchQuery}"</div>
              ) : (
                 searchResults.map((res, i) => (
                   <div key={i} onClick={() => { res.onClick(); setMobileSearchActive(false); }} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(190, 18, 60, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent }}>
                        <Icon name={res.icon} size={16} />
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</div>
                        {res.desc && <div style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{res.desc}</div>}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: C.muted, background: '#f1f5f9', padding: '4px 8px', borderRadius: 6, letterSpacing: '0.05em' }}>{res.type}</div>
                   </div>
                 ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Search Icon - Below Brand on Mobile */}
      <div className="md-block md-hidden" style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}>
        <div 
          className="glass-floating" 
          onClick={() => setOverlayActive(true)}
          style={{ width: 64, height: 64, color: C.accent }}
        >
          <Icon name="search" size={28} />
        </div>
      </div>

      {/* Global Search Overlay (Glass Container) */}
      {overlayActive && (
        <div className="search-overlay reveal">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <button onClick={() => setOverlayActive(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <Icon name="arrow-left" size={24} />
            </button>
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                autoFocus
                placeholder="Search masterclasses..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '16px 20px 16px 52px', color: '#fff', fontSize: 18, outline: 'none' }}
              />
              <div style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Icon name="search" size={20} />
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {q.length > 1 && searchResults.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                 <Icon name="search-x" size={48} style={{ marginBottom: 20, opacity: 0.3 }} />
                 <p fontSize={16}>No results for "{searchQuery}"</p>
               </div>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 {searchResults.map((res, i) => (
                   <div key={i} onClick={() => { res.onClick(); setOverlayActive(false); }} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(190, 18, 60, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
                        <Icon name={res.icon} size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{res.title}</div>
                        <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{res.type} Masterclass</div>
                      </div>
                      <Icon name="chevron-right" size={16} color="#475569" />
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>
      )}
      
      <div className={mobileSearchActive ? 'md-hidden' : ''} style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 16 }}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <div onClick={() => setDrop(!drop)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '8px', borderRadius: 16, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(15,23,42,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Avatar user={user} size={38} />
              <div className="md-hidden" style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.text }}>{user.name || user.username.split('@')[0]}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'capitalize' }}>{user.role}</div>
              </div>
              <Icon name="chevron-down" size={14} color={C.muted} />
            </div>
            {drop && (
              <div className="reveal" style={{ position: 'absolute', right: 0, top: 'calc(100% + 12px)', background: '#fff', borderRadius: 20, width: 240, boxShadow: C.shadowLg, zIndex: 200, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>{user.name || user.username}</div>
                  <div style={{ fontWeight: 500, fontSize: 12, color: C.muted, marginTop: 2 }}>{user.username}</div>
                </div>
                <div style={{ padding: '8px' }}>
                  {user.role === 'admin' && (
                    <MenuItem icon="shield" label="Admin Panel" onClick={() => { setDrop(false); navigate('/admin'); }} />
                  )}
                  <MenuItem icon="user" label="My Profile" onClick={() => { setDrop(false); navigate('/profile'); }} />
                  <MenuItem icon="logout" label="Log Out" color={C.danger} onClick={() => { setDrop(false); navigate('/'); logout(); }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          location.pathname === '/sign-up' ? (
            <Btn size="sm" variant="secondary" onClick={() => navigate('/')}>
              <span className="md-hidden">← Back to Academy</span>
              <span className="md-block md-hidden">← Back</span>
            </Btn>
          ) : (
            <Btn size="sm" onClick={onLoginClick}>Join</Btn>
          )
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
