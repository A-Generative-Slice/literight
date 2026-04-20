import React, { useState } from 'react';
import { Card } from '../components/Common';
import Icon from '../components/Icon';
import motivationBg from '../assets/motivation-bg.png';

const PublicLanding = ({ courses, onCourse }) => {
  // No longer using activeTrack filtering for now since the circle navigator is removed
  const filteredCourses = courses || [];

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff' }}>
      
      {/* Heritage Hero */}
      <section style={{ 
        position: 'relative', 
        height: '75vh', 
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

      {/* Brand Intro / About Section (Replaces Circles) */}
      <section style={{ padding: '80px 0 100px', position: 'relative', zIndex: 3 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 var(--container-px)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.5em', color: '#444', marginBottom: 32 }}>THE LEGACY</div>
          <p style={{ 
            fontSize: 'clamp(18px, 4vw, 22px)', 
            lineHeight: 1.6, 
            fontWeight: 500, 
            color: '#eee',
            letterSpacing: '-0.01em'
          }}>
            LITERIGHT ACADEMY exists to translate Litelab's independent lighting design expertise into professional pathways for new learners. 
            Specializing in sustainable lighting, IoT solutions, and home automation, we synergize engineering and passionate design 
            to deliver qualitative, industry-grade education for the next generation of designers.
          </p>
          <div style={{ marginTop: 48, height: 1, width: 80, background: 'rgba(255,255,255,0.2)', margin: '48px auto' }} />
        </div>
      </section>

      {/* Courses Section - NEW High Contrast Design */}
      <section id="courses" style={{ padding: '0 0 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 40 }}>
            {filteredCourses.map((c, i) => (
              <div 
                key={i} 
                onClick={() => onCourse(c)}
                style={{ cursor: 'pointer', animationDelay: `${i * 0.1}s` }}
                className="reveal"
              >
                {/* Solid White High-Contrast Card */}
                <div style={{ 
                  background: '#fff', 
                  padding: 0, 
                  borderRadius: 0, 
                  overflow: 'hidden',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.4)';
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
                        <span style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.2em', color: '#888', marginBottom: 4 }}>INSTRUCTOR</span>
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#000' }}>{c.instructor.toUpperCase()}</span>
                      </div>
                      <div style={{ width: 40, height: 40, border: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Icon name="arrow" size={14} color="#000" />
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
