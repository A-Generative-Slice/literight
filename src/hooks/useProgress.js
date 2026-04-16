import { useState, useEffect } from 'react';

/**
 * Custom hook to track and persist user progress in courses.
 * Initially uses localStorage but designed to sync with a backend.
 */
export const useProgress = (courseId) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(`progress_${courseId}`);
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem(`progress_${courseId}`, JSON.stringify(progress));
  }, [courseId, progress]);

  /**
   * Update progress for a specific lesson.
   * @param {string} lessonId 
   * @param {number} timestamp - The current time in seconds.
   * @param {boolean} completed - Whether the lesson is finished.
   */
  const updateLessonProgress = (lessonId, timestamp, completed = false) => {
    setProgress(prev => ({
      ...prev,
      [lessonId]: {
        timestamp,
        completed: completed || (prev[lessonId]?.completed)
      }
    }));
  };

  /**
   * Get the last saved timestamp for a lesson.
   */
  const getLessonTimestamp = (lessonId) => {
    return progress[lessonId]?.timestamp || 0;
  };

  /**
   * Check if a lesson is completed.
   */
  const isLessonCompleted = (lessonId) => {
    return !!progress[lessonId]?.completed;
  };

  return {
    progress,
    updateLessonProgress,
    getLessonTimestamp,
    isLessonCompleted
  };
};
