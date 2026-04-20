import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLmsStore } from '../stores/useLmsStore';
import { Avatar } from './Common';
import Icon from './Icon';

export const PublicNav = ({ onLoginClick, user }) => {
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
        // 1. Check Course Title
        if (course.title.toLowerCase().includes(query)) {
          results.push({
            id: course.id,
            title: course.title,
            type: 'COURSE',
            parent: course.instructor,
            path: `/course/${course.id}`
          });
        }

        // 2. Check Chapters (Modules)
        course.chapters?.forEach(chapter => {
          if (chapter.title.toLowerCase().includes(query)) {
            results.push({
              id: `${course.id}_ch_${chapter.id}`,
              title: chapter.title,
              type: 'MODULE',
              parent: course.title,
              path: `/course/${course.id}` // Modules usually don't have deep links yet, go to course
            });
          }

          // 3. Check Lessons (Sessions)
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

      setSearchResults(results.slice(0, 8)); // Show up to 8 mixed results
    }
  }, [searchTerm, courses]);

  const handleResultClick = (path) => {
    setOverlayActive(false);
    setSearchTerm('');
    navigate(path);
  };

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
              onClick={isAuthPage ? () => navigate('/') : onLoginClick}
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
              {isAuthPage ? 'BACK TO ACADEMY' : 'GET STARTED'}
            </button>
          )}
        </div>

        <div className="md-block" style={{ display: 'none' }}>
           <button 
            onClick={() => setOverlayActive(true)}
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

      {overlayActive && (
        <div style={{ position: 'fixed', inset: 0, background: '#111', zIndex: 1100, padding: '60px var(--container-px)', animation: 'reveal 0.3s forwards', overflowY: 'auto' }}>
          <button 
            onClick={() => {
              setOverlayActive(false);
              setSearchTerm('');
            }}
            style={{ position: 'fixed', top: 30, right: 30, background: 'none', border: '1px solid rgba(255,255,255,0.2)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
          >
            <Icon name="x" size={18} />
          </button>
          
          <div style={{ maxWidth: 800, margin: '100px auto' }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.4em', marginBottom: 20, color: '#444' }}>ACADEMY SEARCH</div>
            <input 
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="FIND A TRACK, MODULE OR SESSION..." 
              style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #fff', padding: '20px 0', fontSize: 'clamp(24px, 5vw, 40px)', color: '#fff', fontWeight: 900, outline: 'none', letterSpacing: '-0.03em' }}
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
                      padding: '16px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.4s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.paddingLeft = '15px';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.paddingLeft = '0';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.1em', background: '#fff', color: '#000', padding: '2px 8px' }}>{result.type}</span>
                        <span style={{ fontSize: 9, color: '#555', fontWeight: 900, letterSpacing: '0.1em' }}>{result.parent?.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{result.title.toUpperCase()}</div>
                    </div>
                    <Icon name="arrow" size={18} />
                  </div>
                ))}
              </div>
            )}

            {searchTerm && searchResults.length === 0 && (
              <div style={{ marginTop: 60, fontSize: 14, color: '#444', letterSpacing: '0.1em', fontWeight: 900 }}>
                NO DIRECT MATCHES FOUND FOR "{searchTerm.toUpperCase()}"
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
