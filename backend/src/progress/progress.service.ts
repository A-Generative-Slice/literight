import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  async saveProgress(userId: string, lessonId: string, timestamp: number, completed: boolean) {
    let progress = await this.progressRepository.findOne({ where: { userId, lessonId } });
    
    if (progress) {
      progress.timestamp = timestamp;
      progress.completed = completed || progress.completed;
      progress.updatedAt = new Date();
    } else {
      progress = this.progressRepository.create({
        userId,
        lessonId,
        timestamp,
        completed,
      });
    }

    await this.progressRepository.save(progress);
    // console.log(`[Progress Saved DB] User: ${userId}, Lesson: ${lessonId}, Time: ${timestamp}s`);
    return progress;
  }

  async getProgress(userId: string, lessonId: string) {
    return await this.progressRepository.findOne({ where: { userId, lessonId } }) || { timestamp: 0, completed: false };
  }

  async getAllProgressForUser(userId: string) {
    return await this.progressRepository.find({ where: { userId } });
  }
}
