import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgressService {
  // Simple in-memory storage. In a real app, this would be a PostgreSQL database.
  private progressStore = new Map<string, { timestamp: number, completed: boolean }>();

  saveProgress(userId: string, lessonId: string, timestamp: number, completed: boolean) {
    const key = `${userId}:${lessonId}`;
    this.progressStore.set(key, { timestamp, completed });
    console.log(`[Progress Saved] User: ${userId}, Lesson: ${lessonId}, Time: ${timestamp}s`);
    return { success: true, timestamp, completed };
  }

  getProgress(userId: string, lessonId: string) {
    const key = `${userId}:${lessonId}`;
    return this.progressStore.get(key) || { timestamp: 0, completed: false };
  }
}
