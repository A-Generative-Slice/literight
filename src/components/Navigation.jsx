import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLmsStore } from '../stores/useLmsStore';
import { Avatar } from './Common';
import Icon from './Icon';

export const PublicNav = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/sign-up';
  
  const { courses } = useLmsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
    } else {
      const results = [];
      const query = searchTerm.toLowerCase();

      courses.forEach(course => {
        if (course.title.toLowerCase().includes(query)) {
          results.push({
            id: course.id,
            title: course.title,
            type: 'COURSE',
            parent: course.instructor,
            path: `/course/${course.id}`
          });
        }
        course.chapters?.forEach(chapter => {
          if (chapter.title.toLowerCase().includes(query)) {
            results.push({
              id: `${course.id}_ch_${chapter.id}`,
              title: chapter.title,
              type: 'MODULE',
              parent: course.title,
              path: `/course/${course.id}`
            });
          }
          chapter.lessons?.forEach(lesson => {
            if (lesson.title.toLowerCase().includes(query)) {
              results.push({
                id: `${course.id}_ls_${lesson.id}`,
                title: lesson.title,
                type: 'SESSION',
                parent: `${course.title} > ${chapter.title}`,
                path: `/course/${course.id}?lessonId=${lesson.id}`
              });
            }
          });
        });
      });

      setSearchResults(results.slice(0, 8));
    }
  }, [searchTerm, courses]);

  const handleResultClick = (path) => {
    setOverlayActive(false);
    setSearchTerm('');
    navigate(path);
  };

  const handleActionClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isAuthPage) {
      navigate('/');
    } else {
      navigate('/sign-up');
    }
  };

  return (
    <>
      {/* Universal Floating Island - Consistent on all devices */}
      {/* Set to the absolute highest Z-index to beat any blockers */}
      <nav style={{ 
        position: 'fixed', 
        top: 'clamp(20px, 4vw, 30px)', 
        right: 'clamp(20px, 4vw, 30px)', 
        zIndex: 99999, 
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'auto' // Parent now active to avoid click loss
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'clamp(8px, 1vw, 12px)',
          padding: 'clamp(8px, 1.5vw, 10px) clamp(8px, 1.5vw, 10px) clamp(8px, 1.5vw, 10px) clamp(16px, 3.5vw, 24px)',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 100,
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          pointerEvents: 'auto'
        }}>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOverlayActive(true);
            }} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#fff', 
              padding: '8px 12px', 
              display: 'flex', 
              alignItems: 'center'
            }}
          >
            <Icon name="search" size={20} />
          </button>
          
          {user ? (
             <button 
               type="button"
               onClick={(e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 navigate('/profile');
               }}
               style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
             >
               <Avatar user={user} size={36} />
             </button>
          ) : (
            <button 
              type="button"
              onClick={handleActionClick}
              style={{ 
                background: '#fff', 
                color: '#000', 
                border: 'none', 
                padding: '14px clamp(24px, 4vw, 36px)', // Expanded hitbox
                fontSize: 'clamp(10px, 1.8vw, 11px)', 
                fontWeight: 900, 
                cursor: 'pointer', 
                letterSpacing: '0.15em',
                borderRadius: 100,
                textTransform: 'uppercase',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isAuthPage ? 'BACK TO ACADEMY' : 'GET STARTED'}
            </button>
          )}
        </div>
      </nav>

      {/* Search Overlay */}
      {overlayActive && (
        <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 110000, padding: '60px var(--container-px)', animation: 'reveal 0.3s forwards', overflowY: 'auto' }}>
          <button 
            type="button"
            onClick={() => {
              setOverlayActive(false);
              setSearchTerm('');
            }}
            style={{ position: 'fixed', top: 30, right: 30, border: '1px solid rgba(255,255,255,0.2)', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', background: 'none' }}
          >
            <Icon name="x" size={20} />
          </button>
          
          <div style={{ maxWidth: 800, margin: '100px auto' }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.4em', marginBottom: 20, color: '#444' }}>ACADEMY SEARCH</div>
            <input 
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="FIND A TRACK, MODULE OR SESSION..." 
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #fff', padding: '24px 0', fontSize: 'clamp(24px, 5vw, 40px)', color: '#fff', fontWeight: 900, outline: 'none', letterSpacing: '-0.03em' }}
            />

            {searchResults.length > 0 && (
              <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 32 }}>
                {searchResults.map(result => (
                  <div 
                    key={result.id}
                    onClick={() => handleResultClick(result.path)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      padding: '20px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.4s'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.1em', background: '#fff', color: '#000', padding: '2px 8px' }}>{result.type}</span>
                        <span style={{ fontSize: 9, color: '#555', fontWeight: 900, letterSpacing: '0.1em' }}>{result.parent?.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: 'clamp(14px, 3vw, 24px)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{result.title.toUpperCase()}</div>
                    </div>
                    <Icon name="arrow" size={20} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
