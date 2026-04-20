import React, { useState, useEffect } from 'react';
import { Logo, Avatar } from './Common';
import Icon from './Icon';

export const PublicNav = ({ onLoginClick, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: 80, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 var(--container-px)', 
      zIndex: 1000,
      background: isScrolled ? 'rgba(0,0,0,0.98)' : 'transparent',
      borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
      transition: 'all 0.3s'
    }}>
      <Logo size="md" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <button onClick={() => setOverlayActive(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="search" size={18} />
        </button>
        
        {user ? (
           <Avatar user={user} size={30} />
        ) : (
          <button 
            onClick={onLoginClick}
            style={{ 
              background: '#fff', 
              color: '#000', 
              border: 'none', 
              padding: '10px 24px', 
              fontSize: 10, 
              fontWeight: 900, 
              cursor: 'pointer', 
              letterSpacing: '0.15em',
              textTransform: 'uppercase'
            }}
          >
            GET STARTED
          </button>
        )}
      </div>

      {/* Search Overlay */}
      {overlayActive && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1100, padding: '60px var(--container-px)', animation: 'reveal 0.3s forwards' }}>
          <button 
            onClick={() => setOverlayActive(false)}
            style={{ position: 'absolute', top: 30, right: 30, background: 'none', border: '1px solid rgba(255,255,255,0.2)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
          >
            <Icon name="x" size={18} />
          </button>
          
          <div style={{ maxWidth: 800, margin: '100px auto' }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.4em', marginBottom: 20, color: '#444' }}>ACADEMY SEARCH</div>
            <input 
              autoFocus
              placeholder="FIND A TRACK..." 
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #fff', padding: '20px 0', fontSize: 40, color: '#fff', fontWeight: 900, outline: 'none', letterSpacing: '-0.03em' }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};
