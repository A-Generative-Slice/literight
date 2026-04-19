import React from 'react';
import { C, Badge, Card, Avatar } from '../components/Common';
import { Btn } from '../components/Inputs';
import Icon from '../components/Icon';

const PublicLanding = ({ courses, onCourse }) => {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Architectural Hero */}
      <section style={{ 
        position: 'relative', 
        padding: 'clamp(80px, 15vh, 160px) 0', 
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #030712 100%)'
      }}>
        {/* Abstract Background Elements */}
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(190,18,60,0.1) 0%, transparent 60%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(30,58,138,0.1) 0%, transparent 60%)', filter: 'blur(80px)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 99, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 32 }}>
            <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#fb7185' }}>New Masterclass Release</span>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>Architectural Lighting 2.0</span>
          </div>

          <h1 className="reveal" style={{ fontSize: 'clamp(40px, 8vw, 84px)', fontWeight: 900, lineHeight: 0.9, marginBottom: 32, letterSpacing: '-0.04em' }}>
            The Gateway to <br />
            <span style={{ 
              background: 'linear-gradient(to right, #fff 30%, #fb7185 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>Architectural Mastery.</span>
          </h1>

          <p className="reveal" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', maxWidth: 700, margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 500 }}>
            Master the art and science of premium lighting design with world-class practitioners. Join an elite vanguard of architects and designers globally.
          </p>

          <div className="reveal" style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn size="lg" onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}>
              Explore Curriculum
            </Btn>
            <Btn size="lg" variant="secondary" style={{ background: 'transparent', color: '#fff' }}>
              Watch Preview
            </Btn>
          </div>
        </div>
      </section>

      {/* Curriculum Grid */}
      <section style={{ padding: '100px 0', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)' }}>
          <div style={{ marginBottom: 64, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 16 }}>Elite Curriculum</h2>
              <p style={{ color: '#64748b', fontSize: 16, maxWidth: 480 }}>Curated masterclasses designed to transition your career from standard to surgical precision lighting.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'clamp(24px, 4vw, 40px)' }}>
            {(courses || []).map((c, i) => (
              <div key={i} className="reveal hover-lift" style={{ animationDelay: `${i * 0.1}s` }}>
                <Card 
                  onClick={() => onCourse(c)}
                  padding="0"
                  style={{ overflow: 'hidden', background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                >
                  <div style={{ position: 'relative', paddingTop: '62.5%', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={c.thumbnail || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      alt={c.title}
                    />
                    <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
                      <Badge label={c.instructor || "Elite Faculty"} />
                    </div>
                  </div>

                  <div style={{ padding: 32, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      {c.tags?.slice(0, 2).map(t => (
                        <span key={t} style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>{t}</span>
                      ))}
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 12, color: '#fff' }}>{c.title}</h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, marginBottom: 32, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.description}
                    </p>
                    
                    <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="users" size={14} color="#64748b" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>{(c.students || 0).toLocaleString()} Cohort</span>
                      </div>
                      <div style={{ color: C.accent, fontWeight: 900, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                        Access Masterclass <Icon name="arrow" size={12} />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicLanding;
