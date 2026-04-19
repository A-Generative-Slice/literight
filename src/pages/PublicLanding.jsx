import React, { useState } from 'react';
import { Card } from '../components/Common';
import Icon from '../components/Icon';
import motivationBg from '../assets/motivation-bg.png';

const LEARNING_TRACKS = [
  { id: 'architectural', name: 'ARCHITECTURAL', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop' },
  { id: 'interior', name: 'INTERIOR LIGHTING', img: 'https://images.unsplash.com/photo-1513519247388-193ad51c50be?q=80&w=400&auto=format&fit=crop' },
  { id: 'facade', name: 'FACADE DESIGN', img: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?q=80&w=400&auto=format&fit=crop' },
  { id: 'hospitality', name: 'HOSPITALITY', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop' },
  { id: 'urban', name: 'URBAN & SMART', img: 'https://images.unsplash.com/photo-1471018197924-c10a3000632a?q=80&w=400&auto=format&fit=crop' },
  { id: 'landscape', name: 'LANDSCAPE', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&auto=format&fit=crop' },
  { id: 'residential', name: 'RESIDENTIAL', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop' },
  { id: 'sustainable', name: 'SUSTAINABILITY', img: 'https://images.unsplash.com/photo-1518005020250-6859b2827c17?q=80&w=400&auto=format&fit=crop' },
];

const PublicLanding = ({ courses, onCourse }) => {
  const [activeTrack, setActiveTrack] = useState(null);

  const filteredCourses = activeTrack 
    ? (courses || []).filter(c => (c.tags || []).some(t => t.toLowerCase() === activeTrack.toLowerCase()))
    : (courses || []);

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      
      {/* Heritage Hero with Illustration BG */}
      <section style={{ 
        position: 'relative', 
        height: '70vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 var(--container-px)',
        overflow: 'hidden'
      }}>
        {/* The motivation-bg sketch integrated wisely */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: `url(${motivationBg})`, 
          backgroundSize: 'contain', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
          filter: 'invert(1)', // Convert black ink to white glow
          zIndex: 0
        }} />
        
        {/* Gradient Fade to Black */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, #000 90%)', zIndex: 1 }} />

        <div className="reveal" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 800 }}>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, lineHeight: 0.9, marginBottom: 24, letterSpacing: '-0.04em' }}>
            Designing <span style={{ opacity: 0.5 }}>The Speed Of Light.</span>
          </h1>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#888', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
            International Lighting Academy
          </p>
        </div>
      </section>

      {/* 8-Circle Masterclass Navigator */}
      <section style={{ padding: '40px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 3 }}>
        <h2 style={{ fontSize: 13, fontWeight: 900, textAlign: 'center', letterSpacing: '0.3em', marginBottom: 60, color: '#666' }}>EXPLORE MASTERY TRACKS</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: 40,
          padding: '0 var(--container-px)'
        }}>
          {LEARNING_TRACKS.map((track, i) => (
            <div 
              key={i} 
              className="reveal circle-nav-item" 
              onClick={() => setActiveTrack(activeTrack === track.id ? null : track.id)}
              style={{ 
                animationDelay: `${i * 0.05}s`,
                opacity: activeTrack && activeTrack !== track.id ? 0.4 : 1
              }}
            >
              <div className="circle-img" style={{ borderColor: activeTrack === track.id ? '#fff' : 'rgba(255,255,255,0.1)' }}>
                <img src={track.img} alt={track.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="circle-label" style={{ color: activeTrack === track.id ? '#fff' : '#888' }}>{track.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60 }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.02em' }}>
              {activeTrack ? `Featured in ${activeTrack}` : 'Elite Masterclasses'}
            </h2>
            {activeTrack && (
              <button onClick={() => setActiveTrack(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 11, fontWeight: 800, cursor: 'pointer', letterSpacing: '0.1em' }}>
                SHOW ALL COURSES —
              </button>
            )}
          </div>
          
          {filteredCourses.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 40 }}>
              {filteredCourses.map((c, i) => (
                <Card 
                  key={i} 
                  onClick={() => onCourse(c)}
                  padding="0"
                  style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}
                >
                  <div style={{ position: 'relative', paddingTop: '60%', width: '100%' }}>
                    <img src={c.thumbnail} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 16, right: 16, background: '#fff', color: '#000', padding: '4px 12px', fontSize: 10, fontWeight: 900, borderRadius: 2 }}>{c.duration}</div>
                  </div>
                  <div style={{ padding: 32 }}>
                    <h3 style={{ fontSize: 24, marginBottom: 16, lineHeight: 1.1 }}>{c.title}</h3>
                    <p style={{ fontSize: 13, color: '#888', marginBottom: 32, lineHeight: 1.6, height: '3.2em', overflow: 'hidden' }}>{c.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.1em' }}>{c.instructor}</span>
                      <Icon name="arrow" size={16} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ padding: '100px 0', textAlign: 'center', color: '#444' }}>
              <Icon name="info" size={40} style={{ marginBottom: 20, opacity: 0.2 }} />
              <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.1em' }}>NO MASTERCLASSES FOUND IN THIS TRACK</div>
            </div>
          )}
        </div>
      </section>

      {/* Academy Footer */}
      <footer style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 60 }}>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 24, letterSpacing: '0.1em', marginBottom: 24 }}>LITERIGHT<br/>ACADEMY</div>
            <p style={{ fontSize: 12, color: '#666', lineHeight: 1.8 }}>The elite global platform for mastering the science and art of architectural lighting design.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 24 }}>CURRICULUM</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11, fontWeight: 800, color: '#888' }}>
              <span>MASTERCLASSES</span>
              <span>CERTIFICATIONS</span>
              <span>PARTNERSHIPS</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, marginBottom: 24 }}>ACADEMY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11, fontWeight: 800, color: '#888' }}>
              <span>OUR STORY</span>
              <span>STUDENT WORK</span>
              <span>CONTACT</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 100, fontSize: 10, color: '#333', letterSpacing: '0.1em' }}>
          COPYRIGHT © 2026 LITERIGHT ACADEMY. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
