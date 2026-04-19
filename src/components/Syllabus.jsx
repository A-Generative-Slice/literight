import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, ChevronRight, Lock, HelpCircle } from 'lucide-react';
import { C } from './Common';

const Syllabus = ({ course, progress, onSelectLesson, isLoggedIn }) => {
  const [openChapters, setOpenChapters] = useState({ 0: true });
  if (!course || !course.chapters) return null;

  const toggleChapter = (idx) => setOpenChapters(prev => ({ ...prev, [idx]: !prev[idx] }));

  const getChapterProgress = (chapterIndex) => {
    const chapter = course.chapters[chapterIndex];
    if (!chapter) return { completed: 0, total: 0 };
    const lessonCount = chapter.lessons.length;
    const completedCount = chapter.lessons.filter(l => progress && progress[l.id]?.completed).length;
    const quizCompleted = progress && progress[`quiz_${chapter.id}`]?.completed;
    return { completed: completedCount + (quizCompleted ? 1 : 0), total: lessonCount + (chapter.quiz?.length > 0 ? 1 : 0) };
  };

  const isChapterLocked = (chapterIndex) => {
    if (!isLoggedIn) return false;
    if (chapterIndex === 0) return false;
    const prev = getChapterProgress(chapterIndex - 1);
    return prev.completed < prev.total;
  };

  return (
    <div style={{ background: '#000' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h2 style={{ fontSize: 11, fontWeight: 900, color: '#444', letterSpacing: '0.3em' }}>CURRICULUM</h2>
        <div style={{ fontSize: 9, fontWeight: 900, color: '#666', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px' }}>
          {course.chapters.length} MODULES
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {course.chapters.map((chapter, idx) => {
          const locked = isChapterLocked(idx);
          const isOpen = openChapters[idx];
          const { completed, total } = getChapterProgress(idx);
          const isFull = completed === total && total > 0;
          
          return (
            <div key={chapter.id} style={{ 
              border: `1px solid rgba(255,255,255,${isOpen ? 0.3 : 0.05})`,
              background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
              transition: 'all 0.3s',
              opacity: locked ? 0.4 : 1,
            }}>
              <div 
                onClick={() => !locked && toggleChapter(idx)}
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  cursor: locked ? 'not-allowed' : 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: isFull ? '#fff' : isOpen ? '#fff' : '#444' }}>
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.02em', marginBottom: 4 }}>{chapter.title.toUpperCase()}</h3>
                    <div style={{ fontSize: 9, fontWeight: 800, color: '#444', letterSpacing: '0.1em' }}>
                      {completed}/{total} UNITS COMPLETE
                    </div>
                  </div>
                </div>
                {locked ? <Lock size={12} color="#444" /> : <ChevronRight size={14} color="#fff" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />}
              </div>

              {isOpen && !locked && (
                <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {chapter.lessons.map((lesson) => {
                    const completed = progress && progress[lesson.id]?.completed;
                    return (
                      <div 
                        key={lesson.id}
                        onClick={() => onSelectLesson({ ...lesson, type: 'video' })}
                        style={{ 
                          padding: '12px 14px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          transition: '0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {completed ? <CheckCircle2 size={12} color="#fff" /> : <PlayCircle size={12} color="#fff" opacity={0.3} />}
                          <span style={{ fontSize: 12, fontWeight: 700, color: completed ? '#666' : '#fff' }}>{lesson.title.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: 8, fontWeight: 900, color: '#444' }}>VIDEO</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Syllabus;
