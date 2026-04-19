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
      <Logo />

      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <div className="md-hidden" style={{ display: 'flex', gap: 32, fontSize: 11, fontWeight: 900, letterSpacing: '0.2em' }}>
          <span className="hover-lift" style={{ cursor: 'pointer' }}>MASTERCLASSES</span>
          <span className="hover-lift" style={{ cursor: 'pointer' }}>CURRICULUM</span>
          <span className="hover-lift" style={{ cursor: 'pointer' }}>ADMISSIONS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button onClick={() => setOverlayActive(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <Icon name="search" size={18} />
          </button>
          
          {user ? (
             <Avatar user={user} size={32} />
          ) : (
            <button 
              onClick={onLoginClick}
              style={{ background: '#fff', color: '#000', border: 'none', padding: '8px 24px', borderRadius: 2, fontSize: 11, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' }}
            >
              SIGN IN
            </button>
          )}
        </div>
      </div>

      {/* Search Overlay (Minimalist) */}
      {overlayActive && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1100, padding: '60px var(--container-px)', animation: 'reveal 0.3s forwards' }}>
          <button 
            onClick={() => setOverlayActive(false)}
            style={{ position: 'absolute', top: 30, right: 30, background: 'none', border: '1px solid #fff', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
          >
            <Icon name="x" size={20} />
          </button>
          
          <div style={{ maxWidth: 800, margin: '60px auto' }}>
            <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.3em', marginBottom: 20, color: '#444' }}>ACADEMY SEARCH</div>
            <input 
              autoFocus
              placeholder="FIND A MASTERCLASS..." 
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: '2px solid #fff', padding: '20px 0', fontSize: 32, color: '#fff', fontWeight: 900, outline: 'none', letterSpacing: '-0.02em' }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};
