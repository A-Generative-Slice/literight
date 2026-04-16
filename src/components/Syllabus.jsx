import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, ChevronRight, Lock, HelpCircle } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <h2 className="text-2xl font-bold font-title">Course content</h2>
        <span className="text-sm text-text-secondary font-medium">
          {course.chapters.length} chapters • {course.totalLessons} lessons
        </span>
      </div>

      {course.chapters.map((chapter, idx) => {
        const locked = isChapterLocked(idx);
        const isOpen = openChapters[idx];
        const { completed, total } = getChapterProgress(idx);
        
        return (
          <div key={chapter.id} className={`border border-border rounded-2xl transition-all duration-300 ${locked ? 'opacity-60 grayscale' : 'shadow-sm hover:shadow-md bg-white'} overflow-hidden`}>
            <div 
              onClick={() => !locked && toggleChapter(idx)}
              className={`px-6 py-5 flex items-center justify-between cursor-pointer transition-colors ${isOpen ? 'bg-slate-50' : 'bg-white'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${completed === total ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border text-muted'}`}>
                  {completed === total ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary leading-tight">{chapter.title || `Chapter ${idx + 1}`}</h3>
                  <div className="text-xs text-text-secondary mt-0.5">{total} modules · {completed}/{total} done</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {locked ? (
                  <Lock className="w-4 h-4 text-muted" />
                ) : (
                  <ChevronRight className={`w-5 h-5 text-muted transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
                )}
              </div>
            </div>
            
            <div 
              className="transition-all duration-500 ease-in-out"
              style={{ 
                maxHeight: isOpen ? '1000px' : '0',
                opacity: isOpen ? 1 : 0,
                visibility: isOpen ? 'visible' : 'hidden'
              }}
            >
              <div className="divide-y divide-border border-t border-border">
                {chapter.lessons.map((lesson) => {
                  const lessonCompleted = progress && progress[lesson.id]?.completed;
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => !locked && onSelectLesson({ ...lesson, type: 'video' })}
                      className={`px-6 py-4 flex items-center justify-between hover:bg-accentLight/30 transition-all cursor-pointer group ${lessonCompleted ? 'bg-emerald-50/20' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg transition-colors ${lessonCompleted ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-accentLight'}`}>
                          {lessonCompleted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <PlayCircle className={`h-4 w-4 ${locked ? 'text-muted' : 'text-accent'}`} />
                          )}
                        </div>
                        <span className={`text-sm font-semibold transition-colors ${lessonCompleted ? 'text-emerald-700' : 'text-text-primary group-hover:text-accent'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">Video</span>
                        <ChevronRight className="h-4 w-4 text-border group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}

                {chapter.quiz && chapter.quiz.length > 0 && (
                  <div 
                    onClick={() => !locked && onSelectLesson({ id: `quiz_${chapter.id}`, title: `${chapter.title} Quiz`, type: 'quiz', quizData: chapter.quiz, chId: chapter.id })}
                    className={`px-6 py-4 flex items-center justify-between hover:bg-accentLight/30 transition-all cursor-pointer group ${progress && progress[`quiz_${chapter.id}`]?.completed ? 'bg-emerald-50/20' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-colors ${progress && progress[`quiz_${chapter.id}`]?.completed ? 'bg-emerald-100' : 'bg-slate-100 group-hover:bg-accentLight'}`}>
                        {progress && progress[`quiz_${chapter.id}`]?.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <HelpCircle className={`h-4 w-4 ${locked ? 'text-muted' : 'text-accent'}`} />
                        )}
                      </div>
                      <span className={`text-sm font-bold transition-colors ${progress && progress[`quiz_${chapter.id}`]?.completed ? 'text-emerald-700' : 'text-text-primary group-hover:text-accent'}`}>
                        Chapter Knowledge Check
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-accent text-[9px] font-black text-white uppercase tracking-tighter">Required</span>
                      <ChevronRight className="h-4 w-4 text-border group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Syllabus;
