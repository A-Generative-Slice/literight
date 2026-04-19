import React from 'react';
import { C, Badge, Avatar } from '../components/Common';
import { Btn } from '../components/Inputs';
import Icon from '../components/Icon';

const PublicLanding = ({ onCourse, courses }) => (
  <div style={{ background: C.bg }}>
    {/* Hero Section - Elite Professional Look */}
    <div className="md-px-4 reveal" style={{ 
      padding: 'clamp(80px, 15vh, 120px) 32px clamp(120px, 20vh, 160px)', 
      background: '#0f172a', 
      color: '#fff', 
      textAlign: 'center', 
      position: 'relative', 
      overflow: 'hidden',
      borderBottomLeftRadius: 'clamp(40px, 10vw, 100px)',
      borderBottomRightRadius: 'clamp(40px, 10vw, 100px)',
    }}>
      {/* Dynamic Mesh Background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'radial-gradient(circle at 20% 30%, #BE123C 0%, transparent 40%), radial-gradient(circle at 80% 70%, #1e293b 0%, transparent 40%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'url("https://images.unsplash.com/photo-1542744095-2ad48e00b36a?q=80&w=1470&auto=format&fit=crop") center/cover no-repeat', mixBlendMode: 'overlay' }} />
      
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
        <Badge label="Elite Certification Program" color="#fff" />
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, marginTop: 32, marginBottom: 24, lineHeight: 1.05 }}>
          Mastering Light.<br /><span style={{ color: C.accent }}>Architecting Careers.</span>
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#94a3b8', lineHeight: 1.7, marginBottom: 48, maxWidth: 640, margin: '0 auto 48px', fontWeight: 500 }}>
          Litelab delivers bespoke lighting solutions for global architectural landmarks. 
          Through LiteRight Academy, we identify and train the next generation of 
          industry leaders with elite certification.
        </p>
        <div className="md-flex-col md-w-full md-gap-4" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Btn onClick={() => { document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' }) }} size="lg" style={{ minWidth: 220, borderRadius: 16 }} className="md-w-full">Explore Curriculum</Btn>
          <Btn variant="secondary" onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }} size="lg" style={{ minWidth: 220, borderRadius: 16, background: 'rgba(255,255,255,0.05)', color: '#fff', borderColor: 'rgba(255,255,255,0.1)' }} className="md-w-full">Our Portfolio</Btn>
        </div>
      </div>
    </div>

    {/* Course Discovery - Domestika Grid Style */}
    <div id="curriculum" className="md-pt-8 reveal" style={{ maxWidth: 1240, margin: '-60px auto 120px', padding: '0 var(--container-px)', position: 'relative', zIndex: 5 }}>
      <Card style={{ padding: 'clamp(32px, 5vw, 60px) clamp(20px, 4vw, 48px)' }} className="md-p-6">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Badge label="Professional Modules" />
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, color: C.text, margin: '16px 0' }}>Academy Curriculum</h2>
          <div style={{ width: 80, height: 4, background: C.accent, margin: '0 auto', borderRadius: 99 }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 100%, 320px), 1fr))', gap: 'clamp(20px, 4vw, 40px)' }}>
          {courses?.map(course => (
            <div key={course.id} className="hover-lift" onClick={() => onCourse(course)} style={{ background: '#fff', borderRadius: 32, border: `1px solid ${C.border}`, cursor: 'pointer', overflow: 'hidden', boxShadow: C.shadow }}>
              <div style={{ height: 260, background: course.thumbnail ? `url(${course.thumbnail}) center/cover no-repeat` : '#f1f5f9', position: 'relative' }}>
                <div className="glass" style={{ position: 'absolute', bottom: 16, left: 16, right: 16, padding: '8px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ fontSize: 13, color: C.text, fontWeight: 800 }}>{course.duration || '3h 20m'}</div>
                   <div style={{ padding: '4px 10px', background: C.accent, color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 900 }}>${course.price || 0}</div>
                </div>
              </div>

              <div style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900, marginBottom: 16, lineHeight: 1.3, color: C.text }}>{course.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <Avatar user={{ name: course.instructor }} size={32} />
                  <div style={{ fontSize: 14, color: C.muted }}>By <strong style={{ color: C.text }}>{course.instructor}</strong></div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <div style={{ height: 8, width: 8, borderRadius: '50%', background: C.success }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>Enrollment Open</span>
                  </div>
                  <Btn size="sm" variant="ghost" style={{ fontWeight: 800, padding: '4px 8px' }}>Syllabus →</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);

export default PublicLanding;
