import React, { useState } from 'react';
import { C, Badge, Card, Avatar } from '../components/Common';
import { Btn } from '../components/Inputs';
import Icon from '../components/Icon';
import Syllabus from '../components/Syllabus';
import QuizPlayer from '../components/QuizPlayer';
import { useProgress } from '../hooks/useProgress';

const CourseDetail = ({ course, onEnroll, isLoggedIn }) => {
  const [activeLesson, setActiveLesson] = useState(null);
  const { progress, updateLessonProgress } = useProgress(course.id);

  const handlePassQuiz = (chId, score) => {
    updateLessonProgress(`quiz_${chId}`, 0, true);
  };

  const currentContent = activeLesson?.type === 'quiz' ? (
    <div style={{ padding: '40px 0' }}>
      <QuizPlayer 
        quiz={activeLesson.quizData} 
        passPercentage={course.passPercentage || 80}
        onPass={(s) => handlePassQuiz(activeLesson.chId, s)}
        onFail={() => {}} 
      />
    </div>
  ) : (
    <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
      <video src={activeLesson ? activeLesson.video : (course.trailer || '/trailer.mp4')} controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Hero Section */}
      <div style={{ 
        background: course.thumbnail 
          ? `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.7)), url(${course.thumbnail}) center/cover no-repeat`
          : `linear-gradient(135deg, ${C.text} 0%, #1e293b 100%)`, 
        color: '#fff', 
        padding: '60px 0 100px 0', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {course.tags?.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t}</span>)}
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>{course.title}</h1>
            <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32, maxWidth: 600 }}>{course.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar user={{ name: course.instructor }} size={48} />
                <div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>Instructor</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{course.instructor}</div>
                </div>
              </div>
              <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>Rating</div>
                <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="star" size={14} color="#f59e0b" /> {course.rating} ({course.students} students)
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Card style={{ padding: 40, background: '#fff', color: C.text, boxShadow: '10px 30px 60px rgba(0,0,0,0.1)', transform: 'translateY(40px)' }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>${course.price}</span>
                  <span style={{ color: C.muted, textDecoration: 'line-through' }}>${course.originalPrice || course.price * 1.5}</span>
                </div>
                <div style={{ color: C.success, fontSize: 13, fontWeight: 700 }}>Exclusive Early Bird Offer</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Btn full size="lg" onClick={onEnroll}>Enroll Now — Lifetime Access</Btn>
                <div style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 12 }}>
                  30-Day Money-Back Guarantee
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '80px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 60 }}>
        <div>
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>About this course</h2>
            <div style={{ color: C.muted, fontSize: 16, lineHeight: 1.8 }}>
              {course.description}
            </div>
          </section>

          {isLoggedIn ? (
            <section>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Course Player</h2>
              {currentContent}
              <div style={{ marginTop: 24, padding: 24, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{activeLesson?.title || 'Course Preview'}</h3>
                <p style={{ fontSize: 14, color: C.muted }}>Select a lesson from the curriculum to start learning.</p>
              </div>
            </section>
          ) : (
            <section style={{ padding: 60, background: C.accentLight, borderRadius: 24, textAlign: 'center', border: `2px dashed ${C.accent}33` }}>
              <Icon name="lock" size={48} color={C.accent} />
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, margin: '20px 0 12px 0' }}>Enrolled Students Only</h2>
              <p style={{ color: C.muted, marginBottom: 32 }}>Sign in or enroll to access all professional lessons and certification quizzes.</p>
              <Btn onClick={onEnroll}>Get Started Now</Btn>
            </section>
          )}
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 40 }}>
            <Syllabus 
              course={course} 
              progress={progress} 
              onSelectLesson={(l) => setActiveLesson(l)} 
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
