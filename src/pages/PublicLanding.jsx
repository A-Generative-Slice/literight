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
      
      {/* Heritage Hero */}
      <section style={{ 
        position: 'relative', 
        height: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 var(--container-px)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundImage: `url(${motivationBg})`, 
          backgroundSize: 'contain', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat',
          opacity: 0.08,
          filter: 'invert(1)',
          zIndex: 0
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, #000 95%)', zIndex: 1 }} />

        <div className="reveal" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 900 }}>
          <h1 style={{ fontSize: 'clamp(40px, 10vw, 90px)', fontWeight: 900, lineHeight: 0.85, marginBottom: 32, letterSpacing: '-0.05em' }}>
            Designing <br/><span style={{ opacity: 0.3 }}>The Speed Of Light.</span>
          </h1>
          <p style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
            International Learning Academy
          </p>
        </div>
      </section>

      {/* 8-Circle Masterclass Navigator */}
      <section style={{ padding: '40px 0', maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 3 }}>
        <h2 style={{ fontSize: 10, fontWeight: 900, textAlign: 'center', letterSpacing: '0.4em', marginBottom: 60, color: '#444' }}>EXPLORE MASTERY TRACKS</h2>
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
                opacity: activeTrack && activeTrack !== track.id ? 0.3 : 1
              }}
            >
              <div className="circle-img" style={{ borderColor: activeTrack === track.id ? '#fff' : 'rgba(255,255,255,0.1)' }}>
                <img src={track.img} alt={track.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="circle-label" style={{ color: activeTrack === track.id ? '#fff' : '#666' }}>{track.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" style={{ padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 80 }}>
            <h2 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.03em' }}>
              {activeTrack ? activeTrack.toUpperCase() : 'Elite Masterclasses'}
            </h2>
            {activeTrack && (
              <button onClick={() => setActiveTrack(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 10, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.2em', textDecoration: 'underline' }}>
                SHOW ALL COURSES
              </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 60 }}>
            {filteredCourses.map((c, i) => (
              <div 
                key={i} 
                onClick={() => onCourse(c)}
                style={{ cursor: 'pointer', animationDelay: `${i * 0.1}s` }}
                className="reveal"
              >
                <div style={{ position: 'relative', paddingTop: '65%', width: '100%', marginBottom: 32, overflow: 'hidden' }}>
                    <img src={c.thumbnail} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                    <div style={{ position: 'absolute', top: 20, right: 20, background: '#fff', color: '#000', padding: '6px 14px', fontSize: 9, fontWeight: 900, borderRadius: 0 }}>{c.duration}</div>
                </div>
                <h3 style={{ fontSize: 28, marginBottom: 16, lineHeight: 1, fontWeight: 800 }}>{c.title.toUpperCase()}</h3>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 24, lineHeight: 1.6, height: '3.2em', overflow: 'hidden' }}>{c.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', opacity: 0.6 }}>{c.instructor.toUpperCase()}</span>
                  <Icon name="arrow" size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Footer from Screenshot */}
      <footer style={{ padding: '80px 0 40px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)', textAlign: 'center' }}>
          
          {/* Social Icons Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginBottom: 40 }}>
            <Icon name="instagram" size={20} />
            <Icon name="linkedin" size={20} />
            <Icon name="pinterest" size={20} />
            <Icon name="facebook" size={20} />
            <Icon name="twitter" size={20} />
            <Icon name="youtube" size={20} />
          </div>

          {/* Nav Links Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 4vw, 40px)', marginBottom: 40, fontSize: 12, fontWeight: 900, letterSpacing: '0.1em' }}>
            <span style={{ cursor: 'pointer' }}>HOME</span>
            <span style={{ cursor: 'pointer' }}>ABOUT</span>
            <span style={{ cursor: 'pointer' }}>PROJECTS</span>
            <span style={{ cursor: 'pointer' }}>TEAM</span>
            <span style={{ cursor: 'pointer' }}>CONTACT</span>
          </div>

          {/* Legal Row */}
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 700, letterSpacing: '0.02em', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              Copyright © 2026. All Rights Reserved <span style={{ opacity: 0.3, margin: '0 10px' }}>|</span> Privacy Policy <span style={{ opacity: 0.3, margin: '0 10px' }}>|</span> Designed and Developed by LITERIGHT ACADEMY
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
