import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, ChevronRight, Lock, HelpCircle } from 'lucide-react';

// Design Tokens (Matching App.jsx)
const C = {
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  text: '#0f172a',
  muted: '#64748b',
  accent: '#e11d48',
  accentLight: '#fff1f2',
  success: '#16a34a',
  warning: '#f59e0b',
  danger: '#dc2626',
};

const Syllabus = ({ course, progress, onSelectLesson }) => {
  const [openChapters, setOpenChapters] = useState({ 0: true });
  
  if (!course || !course.chapters) return null;

  const toggleChapter = (idx) => {
    setOpenChapters(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getChapterProgress = (chapterIndex) => {
    const chapter = course.chapters[chapterIndex];
    if (!chapter) return { completed: 0, total: 0 };
    const lessonCount = chapter.lessons.length;
    const completedCount = chapter.lessons.filter(l => progress && progress[l.id]?.completed).length;
    const quizCompleted = progress && progress[`quiz_${chapter.id}`]?.completed;
    return { 
      completed: completedCount + (quizCompleted ? 1 : 0), 
      total: lessonCount + (chapter.quiz?.length > 0 ? 1 : 0) 
    };
  };

  const isChapterLocked = (chapterIndex) => {
    if (chapterIndex === 0) return false;
    const prev = getChapterProgress(chapterIndex - 1);
    return prev.completed < prev.total;
  };

  return (
    <div className="animate-fade-in" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, color: C.text }}>Course Content</h2>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.muted, background: C.surface, padding: '4px 12px', borderRadius: 99, border: `1px solid ${C.border}` }}>
          {course.chapters.length} Modules • {course.totalLessons} Lessons
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {course.chapters.map((chapter, idx) => {
          const locked = isChapterLocked(idx);
          const isOpen = openChapters[idx];
          const { completed, total } = getChapterProgress(idx);
          const isFull = completed === total && total > 0;
          
          return (
            <div key={chapter.id} style={{ 
              borderRadius: 20, 
              border: `1px solid ${locked ? C.border : isOpen ? C.accent + '22' : C.border}`,
              background: locked ? C.surface : '#fff',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isOpen && !locked ? '0 12px 30px rgba(225,29,72,0.06)' : 'none',
              opacity: locked ? 0.7 : 1,
            }}>
              {/* Chapter Header */}
              <div 
                onClick={() => !locked && toggleChapter(idx)}
                style={{ 
                  padding: '20px 24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  cursor: locked ? 'not-allowed' : 'pointer',
                  background: isOpen && !locked ? `linear-gradient(to right, ${C.accentLight} 0%, #fff 40%)` : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ 
                    width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800,
                    background: isFull ? C.success : locked ? C.border : isOpen ? C.accent : C.surface,
                    color: isFull || (isOpen && !locked) ? '#fff' : C.muted,
                    transition: 'all 0.3s'
                  }}>
                    {isFull ? <CheckCircle2 size={18} /> : locked ? <Lock size={16} /> : idx + 1}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 700, color: locked ? C.muted : C.text, marginBottom: 2 }}>{chapter.title}</h3>
                    <div style={{ fontSize: 11, fontWeight: 600, color: isFull ? C.success : C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {total} Units • {completed}/{total} Completed
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color={locked ? C.border : C.muted} style={{ 
                  transition: 'transform 0.4s', 
                  transform: isOpen ? 'rotate(90deg)' : 'none' 
                }} />
              </div>

              {isOpen && chapter.objective && (
                <div style={{ padding: '0 24px 16px 76px', marginTop: -8 }}>
                   <div style={{ padding: '8px 12px', background: C.surface, borderRadius: 8, fontSize: 12, color: C.muted, borderLeft: `3px solid ${C.accent}`, lineHeight: 1.5 }}>
                     <strong style={{ color: C.text, fontSize: 10, textTransform: 'uppercase', display: 'block', marginBottom: 2 }}>Module Objective</strong>
                     {chapter.objective}
                   </div>
                </div>
              )}
              
              {/* Lessons List */}
              <div style={{ 
                maxHeight: isOpen ? '2000px' : '0', 
                opacity: isOpen ? 1 : 0, 
                visibility: isOpen ? 'visible' : 'hidden',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                borderTop: isOpen ? `1px solid ${C.border}` : 'none',
                paddingLeft: 30,
              }}>
                <div style={{ padding: '8px 0 20px 0', borderLeft: `2px solid ${C.border}`, marginLeft: 6 }}>
                  {chapter.lessons.map((lesson, lIdx) => {
                    const lessonCompleted = progress && progress[lesson.id]?.completed;
                    return (
                      <div 
                        key={lesson.id} 
                        onClick={() => !locked && onSelectLesson({ ...lesson, type: 'video' })}
                        style={{ 
                          padding: '14px 24px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s',
                          borderRadius: '0 12px 12px 0',
                        }}
                        className="group"
                        onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        {/* Timeline Node */}
                        <div style={{ 
                          position: 'absolute', left: -7, top: '50%', transform: 'translateY(-50%)', 
                          width: 12, height: 12, borderRadius: '50%', background: lessonCompleted ? C.success : '#fff', 
                          border: `2.5px solid ${lessonCompleted ? C.success : C.border}`,
                          transition: 'all 0.3s',
                          zIndex: 2
                        }} />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <PlayCircle size={18} color={lessonCompleted ? C.success : C.accent} style={{ opacity: lessonCompleted ? 0.7 : 1 }} />
                          <span style={{ 
                            fontSize: 14, fontWeight: lessonCompleted ? 600 : 700, 
                            color: lessonCompleted ? C.muted : C.text,
                            textDecoration: lessonCompleted ? 'line-through' : 'none',
                            opacity: lessonCompleted ? 0.6 : 1
                          }}>{lesson.title}</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: C.muted, letterSpacing: '0.1em', background: C.surface, padding: '2px 8px', borderRadius: 4 }}>Video</span>
                      </div>
                    );
                  })}

                  {chapter.quiz && chapter.quiz.length > 0 && (
                    <div 
                      onClick={() => !locked && onSelectLesson({ id: `quiz_${chapter.id}`, title: `${chapter.title} Quiz`, type: 'quiz', quizData: chapter.quiz, chId: chapter.id })}
                      style={{ 
                        padding: '14px 24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        cursor: 'pointer',
                        position: 'relative',
                        marginTop: 4,
                        borderRadius: '0 12px 12px 0',
                      }}
                      className="group"
                      onMouseEnter={e => e.currentTarget.style.background = '#fef3c7'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ 
                        position: 'absolute', left: -7, top: '50%', transform: 'translateY(-50%)', 
                        width: 12, height: 12, borderRadius: '50%', 
                        background: progress && progress[`quiz_${chapter.id}`]?.completed ? C.success : '#fff', 
                        border: `2.5px solid ${progress && progress[`quiz_${chapter.id}`]?.completed ? C.success : C.warning}`,
                        zIndex: 2
                      }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <HelpCircle size={18} color={C.warning} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Module Knowledge Check</span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: '#fff', background: C.warning, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.05em' }}>Required</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Syllabus;
