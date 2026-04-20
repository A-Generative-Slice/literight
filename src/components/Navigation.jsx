import React, { useState, useEffect } from 'react';
import { Avatar } from './Common';
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
    <>
      <nav style={{ 
        position: 'fixed', 
        top: 30, 
        right: 30, 
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        {/* Desktop Mirror Island */}
        <div className="md-hidden" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          padding: '8px 8px 8px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 100,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <button 
            onClick={() => setOverlayActive(true)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', padding: 8, display: 'flex', alignItems: 'center', opacity: 0.8 }}
          >
            <Icon name="search" size={18} />
          </button>
          
          {user ? (
             <Avatar user={user} size={32} />
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
                borderRadius: 100,
                textTransform: 'uppercase'
              }}
            >
              GET STARTED
            </button>
          )}
        </div>

        {/* Mobile Menu Button - Appears on small screens */}
        <div className="md-block" style={{ display: 'none' }}>
           <button 
            onClick={() => {/* Toggle Mobile Menu logic if needed, for now use Search as entry */}}
            style={{ 
              width: 50, 
              height: 50, 
              background: 'rgba(255,255,255,0.05)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 20 }}>
               <div style={{ height: 1.5, background: '#fff', width: '100%' }} />
               <div style={{ height: 1.5, background: '#fff', width: '100%' }} />
            </div>
           </button>
        </div>
      </nav>

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
    </>
  );
};
