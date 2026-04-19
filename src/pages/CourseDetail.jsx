import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { C, Badge, Card, Avatar } from '../components/Common';
import { Btn } from '../components/Inputs';
import Icon from '../components/Icon';
import Syllabus from '../components/Syllabus';
import QuizPlayer from '../components/QuizPlayer';
import { useProgress } from '../hooks/useProgress';
import { useLmsStore } from '../stores/useLmsStore';

const CourseDetail = ({ course, onEnroll, isLoggedIn }) => {
  const location = useLocation();
  const { user } = useLmsStore();
  const [activeLesson, setActiveLesson] = useState(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lessonId = parseInt(params.get('lessonId'));
    if (lessonId && course?.chapters) {
      for (const ch of course.chapters) {
        const found = ch.lessons?.find(l => l.id === lessonId);
        if (found) {
          setActiveLesson({ ...found, chId: ch.id });
          return;
        }
      }
    }
  }, [location.search, course]);

  const { progress, updateLessonProgress } = useProgress(course.id);

  const handlePassQuiz = (chId, score) => {
    updateLessonProgress(`quiz_${chId}`, 0, true);
  };

  const isPremiumLocked = isLoggedIn && !user?.isPremium && activeLesson && activeLesson.chId > 1;

  const currentContent = isPremiumLocked ? (
    <div className="video-wrapper" style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0f172a', border: `1px solid ${C.border}`, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
      <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', background: '#0f172a' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.98))", backdropFilter: 'blur(10px)', zIndex: 10 }}>
           <div style={{ width: 64, height: 64, background: 'rgba(225,29,72,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid rgba(225,29,72,0.3)' }}>
              <Icon name="lock" size={28} color="#e11d48" />
           </div>
           <h3 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>Premium Module</h3>
           <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 24, textAlign: 'center', maxWidth: 320 }}>This lesson is locked. Upgrade your account to Premium to access the full masterclass.</p>
           <button onClick={() => alert('Premium Upgrade Flow Pending')} style={{ background: '#e11d48', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
             Upgrade to Premium
           </button>
        </div>
      </div>
    </div>
  ) : activeLesson?.type === 'quiz' ? (
    <div style={{ padding: '40px 0' }}>
      <QuizPlayer 
        quiz={activeLesson.quizData} 
        passPercentage={course.passPercentage || 80}
        onPass={(s) => handlePassQuiz(activeLesson.chId, s)}
        onFail={() => {}} 
      />
    </div>
  ) : (
    <div className="video-wrapper" style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#0f172a', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: `1px solid ${C.border}` }}>
      <style>{`
        .play-icon-btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .play-icon-btn:hover { background: #e11d48 !important; border-color: #e11d48 !important; transform: scale(1.1); box-shadow: 0 0 30px rgba(225,29,72,0.6); color: white; }
      `}</style>
      <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', background: '#0f172a' }}>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: "linear-gradient(135deg, rgba(15,23,42,0.85), rgba(30,41,59,0.95)), url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop') center/cover",
          backgroundBlendMode: 'overlay'
        }}>
          <div 
            className="play-icon-btn"
            style={{
              width: 72, height: 72, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontSize: 30, cursor: 'pointer', marginBottom: 20, paddingLeft: 6
            }}
          >
            ▶
          </div>
          <div style={{ color: 'white', textAlign: 'center', zIndex: 10 }}>
            <h3 style={{ margin: '0 0 8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 20, fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              <span style={{ background: '#e11d48', color: 'white', fontSize: 11, padding: '4px 8px', borderRadius: 6, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(225,29,72,0.3)' }}>
                {activeLesson ? activeLesson.title.split(' ')[0] : 'VIDEO'} 
              </span>
              {activeLesson ? activeLesson.title.split(' ').slice(1).join(' ') : 'Welcome to the Course'}
            </h3>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: 14, fontWeight: 500 }}>
              Duration: {activeLesson?.duration || '~14 mins'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="md-py-8" style={{ 
        background: course.thumbnail 
          ? `linear-gradient(to right, rgba(15,23,42,0.95), rgba(15,23,42,0.7)), url(${course.thumbnail}) center/cover no-repeat`
          : `linear-gradient(135deg, ${C.text} 0%, #1e293b 100%)`, 
        color: '#fff', 
        padding: '60px 0 100px 0', 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        <div className="md-grid-reset md-gap-4 md-pb-8" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 'clamp(24px, 4vw, 60px)', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {course?.tags?.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.1)', padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t}</span>)}
            </div>
            <h1 className="md-text-h1" style={{ fontFamily: 'Outfit, sans-serif', fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>{course?.title || 'Course Details'}</h1>
            <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.6, marginBottom: 32, maxWidth: 600 }}>{course?.description || 'No description available for this course yet.'}</p>
            <div className="md-flex-col md-align-start md-gap-4" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar user={{ name: course?.instructor || 'Staff' }} size={48} />
                <div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>Instructor</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{course?.instructor || 'Literight Expert'}</div>
                </div>
              </div>
              <div className="md-hidden" style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>Rating</div>
                <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="star" size={14} color="#f59e0b" /> {course?.rating || '5.0'} ({(course?.students || 0).toLocaleString()} students)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md-grid-reset" style={{ maxWidth: 1200, margin: '-60px auto 100px', padding: '0 var(--container-px)', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 'clamp(24px, 4vw, 60px)', position: 'relative', zIndex: 20 }}>
        <div>
          <section style={{ marginBottom: 60 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 24 }}>About this course</h2>
            <div style={{ color: C.muted, fontSize: 16, lineHeight: 1.8 }}>
              {course?.description || 'Full curriculum details are being finalized. Enrollment provides lifetime access to all future updates.'}
            </div>
          </section>

          {isLoggedIn ? (
            <section>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Course Player</h2>
              {currentContent}
              <div style={{ marginTop: 24, padding: 24, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: C.text }}>{activeLesson?.title || 'Welcome to the Course!'}</h3>
                <p style={{ fontSize: 14, color: C.muted }}>{activeLesson?.description || 'Select a lesson from the curriculum to start learning.'}</p>
              </div>
            </section>
          ) : (
            <section>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 32 }}>Course Preview</h2>
              <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                <div className="md-px-4 md-py-8" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
                  <div className="md-hidden" style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '2px solid rgba(255,255,255,0.2)' }}>
                    <Icon name="lock" size={32} color="#fff" />
                  </div>
                  <h3 className="md-text-h2 md-mb-4" style={{ color: '#fff', fontSize: 24, fontWeight: 800, marginBottom: 12, textAlign: 'center' }}>Unlock the Introduction Video</h3>
                  <p className="md-hidden" style={{ color: '#94a3b8', fontSize: 15, marginBottom: 32, textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>Create a free account or log in to access all professional curriculum content.</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      onClick={() => onEnroll('signup')}
                      style={{ background: '#e11d48', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
                    >
                      Sign Up — It's Free
                    </button>
                    <button
                      onClick={() => onEnroll('login')}
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                    >
                      Log In
                    </button>
                  </div>
                </div>
                <img src={course.thumbnail} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} alt="Course Preview" />
              </div>
              
              <div style={{ marginTop: 24, padding: 24, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}` }}>
                <h3 style={{ fontWeight: 700, marginBottom: 8, color: C.text }}>{activeLesson?.title || 'Course Objective'}</h3>
                <p style={{ fontSize: 14, color: C.muted }}>{activeLesson?.description || course.description}</p>
              </div>
            </section>
          )}
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {!isLoggedIn && (
               <Card padding="32px" style={{ background: '#fff', border: `1px solid ${C.accent}`, boxShadow: '0 20px 40px rgba(190,18,60,0.1)' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: C.text, marginBottom: 8 }}>FREE</div>
                  <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, fontWeight: 500 }}>Unlock module 1 instantly upon registration.</p>
                  <Btn full size="lg" onClick={() => onEnroll('signup')}>Enroll Now</Btn>
               </Card>
            )}
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
