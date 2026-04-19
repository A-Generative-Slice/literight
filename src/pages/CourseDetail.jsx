import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { C, Card, Avatar } from '../components/Common';
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
    <div className="glass" style={{ position: 'relative', overflow: 'hidden', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
          <Icon name="lock" size={24} />
       </div>
       <h3 style={{ color: 'white', fontSize: 24, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.02em' }}>PREMIUM MODULE</h3>
       <p style={{ color: '#666', fontSize: 13, marginBottom: 32, textAlign: 'center', maxWidth: 300, fontWeight: 700, letterSpacing: '0.05em' }}>THIS LESSON IS RESERVED FOR PREMIUM STUDENTS.</p>
       <button onClick={() => alert('Upgrade Flow')} style={{ background: '#fff', color: '#000', border: 'none', padding: '14px 32px', fontSize: 11, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' }}>UPGRADE NOW</button>
    </div>
  ) : (
    <div style={{ background: '#000', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
      <div style={{ position: 'relative', paddingTop: '56.25%', width: '100%', background: '#000' }}>
         <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid #fff' }}>
              <span style={{ fontSize: 24, marginLeft: 4 }}>▶</span>
            </div>
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.3em', color: '#666', marginBottom: 8 }}>{activeLesson ? 'PLAYING UNIT' : 'READY TO START'}</div>
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>{activeLesson ? activeLesson.title.toUpperCase() : 'COURSE PREVIEW'}</h3>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#fff', paddingBottom: 100 }}>
      {/* Hero Section */}
      <div style={{ 
        height: 500,
        background: course.thumbnail 
          ? `linear-gradient(to bottom, transparent, #000), url(${course.thumbnail}) center/cover no-repeat`
          : '#000', 
        padding: '100px 0', 
        display: 'flex',
        alignItems: 'flex-end'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 var(--container-px)', width: '100%' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {course?.tags?.map(t => <span key={t} style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '5px 14px', fontSize: 9, fontWeight: 900, letterSpacing: '0.1em' }}>{t.toUpperCase()}</span>)}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em', marginBottom: 32 }}>{course?.title?.toUpperCase()}</h1>
          
          <div style={{ display: 'flex', gap: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar user={{ name: course?.instructor }} size={40} />
              <div>
                <div style={{ fontSize: 9, color: '#666', fontWeight: 900, letterSpacing: '0.1em' }}>LEAD INSTRUCTOR</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{course?.instructor?.toUpperCase()}</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#666', fontWeight: 900, letterSpacing: '0.1em' }}>RATING</div>
              <div style={{ fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                {course?.rating} <span style={{ opacity: 0.5 }}>/ 1,200+ STUDENTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md-grid-reset" style={{ maxWidth: 1200, margin: '60px auto', padding: '0 var(--container-px)', display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: 80 }}>
        <div>
          <section style={{ marginBottom: 80 }}>
            <h2 style={{ fontSize: 11, fontWeight: 900, color: '#444', letterSpacing: '0.3em', marginBottom: 24 }}>THE SYLLABUS</h2>
            {isLoggedIn ? (
              <div className="reveal">
                {currentContent}
                <div className="glass" style={{ marginTop: 24, padding: 32 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>{activeLesson ? activeLesson.title.toUpperCase() : 'CURRICULUM OVERVIEW'}</h3>
                  <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>{activeLesson?.description || course.description}</p>
                </div>
              </div>
            ) : (
              <div className="glass" style={{ position: 'relative', overflow: 'hidden', minHeight: 400 }}>
                 <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: 40 }}>
                    <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Icon name="lock" size={24} />
                    </div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}>UNLOCK THE MASTERCLASS</h3>
                    <p style={{ color: '#666', fontSize: 13, textAlign: 'center', maxWidth: 300, marginBottom: 32, fontWeight: 700, letterSpacing: '0.05em' }}>REGISTRATION IS REQUIRED TO ACCESS THE PROFESSIONAL CURRICULUM.</p>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <button onClick={() => onEnroll('signup')} style={{ background: '#fff', color: '#000', border: 'none', padding: '14px 32px', fontSize: 11, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' }}>ENROLL FREE</button>
                      <button onClick={() => onEnroll('login')} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 32px', fontSize: 11, fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em' }}>SIGN IN</button>
                    </div>
                 </div>
                 <img src={course.thumbnail} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }} alt="" />
              </div>
            )}
          </section>

          <section>
            <h2 style={{ fontSize: 11, fontWeight: 900, color: '#444', letterSpacing: '0.3em', marginBottom: 24 }}>ABOUT THIS TRACK</h2>
            <div style={{ color: '#888', fontSize: 15, lineHeight: 1.8, maxWidth: 640 }}>{course.description}</div>
          </section>
        </div>

        <aside>
          <div style={{ position: 'sticky', top: 120 }}>
            {!isLoggedIn && (
               <div className="glass" style={{ padding: 40, marginBottom: 40 }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#444', letterSpacing: '0.2em', marginBottom: 12 }}>ACADEMY STATUS</div>
                  <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>FREE</div>
                  <p style={{ color: '#888', fontSize: 12, fontWeight: 700, marginBottom: 32 }}>COMPLETE MODULE 1 AT NO COST.</p>
                  <button onClick={() => onEnroll('signup')} style={{ background: '#fff', color: '#000', border: 'none', padding: '16px', width: '100%', fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', cursor: 'pointer' }}>GET STARTED NOW</button>
               </div>
            )}
            <Syllabus 
              course={course} 
              progress={progress} 
              onSelectLesson={(l) => setActiveLesson(l)} 
              isLoggedIn={isLoggedIn}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
