import React from 'react';
import { C, Badge, Avatar } from '../components/Common';
import { Btn } from '../components/Inputs';
import Icon from '../components/Icon';

const PublicLanding = ({ onCourse, courses }) => (
  <div style={{ background: '#fff' }}>
    {/* Hero Section - Elite Professional Look */}
    <div className="md-py-8 md-px-4" style={{ padding: '100px 32px 140px', background: C.text, color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'url("https://images.unsplash.com/photo-1542744095-2ad48e00b36a?q=80&w=1470&auto=format&fit=crop") center/cover no-repeat' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
        <Badge label="Litelab Corporate Consultancy" color={C.accent} />
        <h1 className="md-text-h1" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 62, fontWeight: 900, marginTop: 24, marginBottom: 24, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
          Mastering Light.<br /><span style={{ color: C.accent }}>Architecting Careers.</span>
        </h1>
        <p style={{ fontSize: 20, color: '#94a3b8', lineHeight: 1.6, marginBottom: 44, maxWidth: 660, margin: '0 auto 44px' }}>
          Litelab is a specialist corporate consultancy delivering bespoke lighting solutions for global architectural projects. Through LiteRight Academy, we identify and train the next generation of industry leaders, providing elite certification and direct career placements.
        </p>
        <div className="md-flex-col md-w-full md-gap-4" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <Btn onClick={() => { document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' }) }} size="lg" style={{ padding: '16px 40px', fontSize: 16 }}>Explore Curriculum</Btn>
          <Btn onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }} size="lg" style={{ padding: '16px 40px', fontSize: 16 }}>View LiteLab</Btn>
        </div>
      </div>
    </div>

    {/* Course Discovery - Domestika Grid Style */}
    <div id="curriculum" className="md-pt-8" style={{ maxWidth: 1200, margin: '80px auto 120px', padding: '0 32px' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 32, fontWeight: 800, color: C.text, marginBottom: 16 }}>Academy Curriculum</h2>
        <div style={{ width: 60, height: 4, background: C.accent, margin: '0 auto', borderRadius: 2 }} />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 32 }}>
        {courses?.map(course => (
          <div key={course.id} onClick={() => onCourse(course)} style={{ background: '#fff', borderRadius: 24, border: `1px solid ${C.border}`, cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = C.border; }}>
            
            <div style={{ height: 230, background: course.thumbnail ? `url(${course.thumbnail}) center/cover no-repeat` : C.surface, position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.7)', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: '#fff', fontWeight: 700 }}>
                {course.duration || '3h 20m'}
              </div>
            </div>

            <div style={{ padding: 28 }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>{course.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Avatar user={{ name: course.instructor }} size={28} />
                <span style={{ fontSize: 14, color: C.muted }}>By <strong>{course.instructor}</strong></span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: C.accent, fontFamily: 'Outfit, sans-serif' }}>${course.price || 0}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>${course.originalPrice || 120}</div>
                </div>
                <Btn size="sm" variant="ghost" style={{ border: 'none', color: C.muted }}>Preview Syllabus →</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PublicLanding;
