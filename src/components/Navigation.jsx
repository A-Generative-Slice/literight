import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { C, Logo, Avatar } from './Common';
import Icon from './Icon';
import { Btn } from './Inputs';
import { useLmsStore } from '../stores/useLmsStore';

export const PublicNav = ({ onLoginClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [drop, setDrop] = useState(false);
  const { user, logout, courses } = useLmsStore();
  const role = user?.role;
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
    <nav className="md-px-4" style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
      <div className="md-gap-4" style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><Logo /></div>
        
        {/* Omni Search */}
        <div style={{ position: 'relative', maxWidth: 400, width: '100%' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 12, color: C.muted }}><Icon name="search" size={16} /></div>
            <input 
              type="text" 
              placeholder="Search courses, modules, or topics..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              style={{ width: '100%', padding: '10px 16px 10px 38px', borderRadius: 20, border: `1px solid ${searchFocused ? C.accent : C.border}`, outline: 'none', background: searchFocused ? '#fff' : C.surface, fontSize: 14, fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
            />
          </div>
          {searchFocused && searchQuery.length > 1 && (
            <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.12)', overflow: 'hidden', padding: '8px 0', zIndex: 300, maxHeight: 400, overflowY: 'auto' }}>
              {searchResults.length === 0 ? (
                 <div style={{ padding: '16px 20px', color: C.muted, fontSize: 13, textAlign: 'center' }}>No results found</div>
              ) : (
                 searchResults.map((res, i) => (
                   <div key={i} onClick={res.onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = C.surface} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(225, 29, 72, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent }}>
                        <Icon name={res.icon} size={14} />
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</div>
                        {res.desc && <div style={{ fontSize: 12, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>{res.desc}</div>}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: C.muted, background: C.surface, padding: '2px 6px', borderRadius: 4 }}>{res.type}</div>
                   </div>
                 ))
              )}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <div style={{ position: 'relative' }}>
            <div onClick={() => setDrop(!drop)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 10px', borderRadius: 8 }}>
              <Avatar user={user} size={34} />
              <Icon name="chevron-down" size={14} color={C.muted} />
            </div>
            {drop && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, width: 210, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', zIndex: 200, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{user.name || user.username}</div>
                </div>
                {role === 'admin' && (
                  <MenuItem icon="shield" label="Admin Panel" onClick={() => { setDrop(false); navigate('/admin'); }} />
                )}
                <MenuItem icon="user" label="My Profile" onClick={() => { setDrop(false); navigate('/profile'); }} />
                <MenuItem icon="logout" label="Log Out" color={C.danger} onClick={() => { setDrop(false); navigate('/'); logout(); }} />
              </div>
            )}
          </div>
        ) : (
          location.pathname === '/sign-up' ? (
            <Btn onClick={() => navigate('/')}>← Back to Academy</Btn>
          ) : (
            <Btn onClick={onLoginClick}>Get Started</Btn>
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
