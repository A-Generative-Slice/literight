import React, { useState, useEffect } from 'react';
import { Card } from '../components/Common';
import Icon from '../components/Icon';
import ParticleField from '../components/ParticleField';

const PublicLanding = ({ courses, onCourse }) => {
  const filteredCourses = courses || [];
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize mouse position to range -1 to 1
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      
      {/* Full-Screen Interactive Hero */}
      <section style={{ 
        position: 'relative', 
        height: '100dvh', // Dynamic Viewport Height for mobile optimization
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 var(--container-px)',
        overflow: 'hidden',
        background: '#000'
      }}>
        <ParticleField />
        
        {/* Parallax Content Wrapper */}
        <div className="reveal" style={{ 
          position: 'relative', 
          zIndex: 2, 
          textAlign: 'center', 
          maxWidth: 1000,
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
          transition: 'transform 0.1s ease-out'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(40px, 12vw, 120px)', 
            fontWeight: 900, 
            lineHeight: 0.8, 
            marginBottom: 24, 
            letterSpacing: '-0.06em',
            textTransform: 'uppercase'
          }}>
            Literight <br/>
            <span style={{ opacity: 0.15 }}>Academy</span>
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(10px, 2vw, 14px)', 
            fontWeight: 900, 
            color: '#fff', 
            letterSpacing: '0.4em', 
            textTransform: 'uppercase',
            opacity: 0.6,
            marginBottom: 60,
            maxWidth: 600,
            margin: '0 auto 60px'
          }}>
            Designing the speed of light.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <div style={{ 
              height: 1, 
              width: 100, 
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)' 
            }} />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', opacity: 0.3, fontSize: 8, fontWeight: 900, letterSpacing: '0.5em' }}>
          SCROLL TO EXPLORE
        </div>
      </section>

      {/* Brand Intro / About Section */}
      <section style={{ padding: '120px 0', position: 'relative', zIndex: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 var(--container-px)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.5em', color: '#444', marginBottom: 40 }}>THE LEGACY</div>
          <p style={{ 
            fontSize: 'clamp(18px, 4vw, 24px)', 
            lineHeight: 1.5, 
            fontWeight: 400, 
            color: '#eee',
            letterSpacing: '-0.01em'
          }}>
            LITERIGHT ACADEMY exists to translate Litelab's independent lighting design expertise into professional pathways for new learners. 
            Specializing in sustainable lighting, IoT solutions, and home automation, we synergize engineering and passionate design 
            to deliver qualitative, industry-grade education.
          </p>
        </div>
      </section>

      {/* Courses Section - Solid White Cards */}
      <section id="courses" style={{ padding: '60px 0 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 60 }}>
            {filteredCourses.map((c, i) => (
              <div 
                key={i} 
                onClick={() => onCourse(c)}
                style={{ cursor: 'pointer', animationDelay: `${i * 0.1}s` }}
                className="reveal"
              >
                <div style={{ 
                  background: '#fff', 
                  padding: 0, 
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  border: '1px solid transparent'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 40px 80px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ position: 'relative', paddingTop: '60%', width: '100%', overflow: 'hidden' }}>
                      <img src={c.thumbnail} alt={c.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: 20, right: 20, background: '#000', color: '#fff', padding: '6px 14px', fontSize: 9, fontWeight: 900 }}>{c.duration}</div>
                  </div>
                  
                  <div style={{ padding: '40px' }}>
                    <h3 style={{ fontSize: 24, marginBottom: 16, lineHeight: 1.1, fontWeight: 900, color: '#000' }}>{c.title.toUpperCase()}</h3>
                    <p style={{ fontSize: 13, color: '#444', marginBottom: 32, lineHeight: 1.6, height: '3.2em', overflow: 'hidden' }}>{c.description}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.2em', color: '#888' }}>INSTRUCTOR</span>
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#000' }}>{c.instructor.toUpperCase()}</span>
                      </div>
                      <div style={{ width: 44, height: 44, border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Icon name="arrow" size={16} color="#000" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer style={{ padding: '100px 0 60px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginBottom: 40 }}>
            {[
              { name: 'instagram', url: 'https://www.instagram.com/lite.lab/' },
              { name: 'pinterest', url: 'https://in.pinterest.com/litelabindia/_created/' },
              { name: 'linkedin', url: 'https://www.linkedin.com/in/litelab-india-b78729277/' },
              { name: 'facebook', url: 'https://www.facebook.com/litelab.india/' },
              { name: 'x-social', url: 'https://x.com/litelab_india' },
              { name: 'youtube', url: 'https://www.youtube.com/@litelab4250' }
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', transition: '0.3s', opacity: 0.8 }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}>
                <Icon name={s.name} size={20} />
              </a>
            ))}
          </div>
          
          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Copyright © 2026. All Rights Reserved | Privacy Policy | Designed and Developed by <a href="https://a-generative-slice.github.io/A-generative-slice/" target="_blank" rel="noopener noreferrer" style={{ color: '#FF6F00', textDecoration: 'none', fontWeight: 900 }}>A Generative Slice</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
