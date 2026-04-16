import React from 'react';
import { C, Logo, Badge } from '../components/Common';
import { Btn } from '../components/Inputs';
import Icon from '../components/Icon';

const PublicLanding = ({ onCourse, courses }) => (
  <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>
    {/* Hero */}
    <div style={{ margin: '48px 0 56px', padding: '56px', background: `linear-gradient(135deg,#fff 0%,${C.accentLight} 60%,#ffe4e6 100%)`, borderRadius: 20, color: C.text, position: 'relative', overflow: 'hidden', border: `1px solid ${C.border}` }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(225,29,72,0.05)' }} />
      <Badge label="Professional Certification" color="#60a5fa" />
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 44, fontWeight: 800, marginTop: 20, marginBottom: 16, lineHeight: 1.15, maxWidth: 560 }}>
        Master Architectural Lighting Design
      </h1>
      <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.65, maxWidth: 460, marginBottom: 32 }}>
        Industry-grade curriculum taught by working professionals. Learn at your pace, earn your certification.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Btn onClick={() => onCourse(courses[0])} size="lg" style={{ background: C.accent }}>
          <Icon name="play-circle" size={18} color="#fff" /> Explore Courses
        </Btn>
      </div>
      <div style={{ display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {[['1,247', 'Students'], ['18', 'Video Lessons'], ['Certificate', 'On Completion']].map(([v, l]) => (
          <div key={l}><div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{v}</div><div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{l}</div></div>
        ))}
      </div>
    </div>

    {/* Course Grid */}
    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 26, fontWeight: 800, marginBottom: 24, color: C.text }}>Available Courses</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 24 }}>
      {courses?.length > 0 ? courses.map(course => (
        <div key={course.id} onClick={() => onCourse(course)} style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,73,255,0.18)'; e.currentTarget.style.borderColor = `${C.accent}33`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = C.border; }}>
          {/* Thumbnail */}
          <div style={{ height: 200, background: course.thumbnail ? `url(${course.thumbnail}) center/cover no-repeat` : `linear-gradient(135deg,${C.bg},${C.surface})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderBottom: `1px solid ${C.border}` }}>
            {course.thumbnail ? (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />
            ) : null}
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)', zIndex: 1 }}>
              <Icon name="play" size={24} color="#ffffff" />
            </div>
            <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 2 }}><Badge label="Best Seller" color="#f59e0b" /></div>
            <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.5)', padding: '4px 10px', borderRadius: 6, zIndex: 2 }}>
              <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{course.totalLessons || 0} lessons</span>
            </div>
          </div>
          {/* Info */}
          <div style={{ padding: '20px 20px 24px' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {course.tags?.map(t => <Badge key={t} label={t} />)}
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{course.title || 'Untitled Course'}</h3>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.55, marginBottom: 16 }}>{course.description?.slice(0, 90) || 'No description available.'}…</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, fontSize: 13 }}>
              <Icon name="star" size={14} color="#f59e0b" />
              <strong>{course.rating || '5.0'}</strong>
              <span style={{ color: C.muted }}>·</span>
              <span style={{ color: C.muted }}>{(course.students || 0).toLocaleString()} students</span>
              <span style={{ color: C.muted }}>·</span>
              <span style={{ color: C.muted }}>{course.duration || 'Flexible'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
              <div>
                <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>${course.price || '0'}</span>
                <span style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'line-through', marginLeft: 8 }}>${course.originalPrice || (course.price * 1.5) || '0'}</span>
              </div>
              <Btn size="sm">Preview <Icon name="arrow" size={14} color="#fff" /></Btn>
            </div>
          </div>
        </div>
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', background: C.surface, borderRadius: 20, border: `2px dashed ${C.border}` }}>
          <Icon name="book-open" size={48} color={C.muted} />
          <h3 style={{ marginTop: 16, fontWeight: 700, color: C.text }}>Our classes are currently full</h3>
          <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>New Cohorts starting next week. Follow us for updates!</p>
        </div>
      )}
    </div>
  </div>
);

export default PublicLanding;
