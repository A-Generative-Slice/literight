import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Course } from './entities/course.entity';
import { Chapter } from './entities/chapter.entity';
import { Lesson } from './entities/lesson.entity';

@Injectable()
export class CoursesService implements OnModuleInit {
  private readonly dataPath = path.join(process.cwd(), 'data', 'courses.json');

  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
  ) {}

  async onModuleInit() {
    this.ensureDataDirectory();
    await this.migrateFromJsonIfNeeded();
  }

  private ensureDataDirectory() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private async migrateFromJsonIfNeeded() {
    const courseCount = await this.courseRepository.count();
    if (courseCount === 0) {
      console.log('Database empty. Attempting migration from courses.json...');
      try {
        let coursesToMigrate: any[] = [];
        if (fs.existsSync(this.dataPath)) {
          const data = fs.readFileSync(this.dataPath, 'utf8');
          coursesToMigrate = JSON.parse(data);
        } else {
          // Default template
          coursesToMigrate = [{
            title: 'Comprehensive Lighting Design Course',
            instructor: 'Admin',
            trailer: '/trailer.mp4',
            thumbnail: '',
            passPercentage: 80,
            price: 199, originalPrice: 299,
            rating: 4.9, students: 1247,
            duration: '3h 0m', totalLessons: 12,
            description: 'Master the art and science of architectural lighting. This industry-grade curriculum covers physics, human perception, architectural principles, and real-world frameworks for residential and commercial spaces.',
            tags: ['Architecture', 'Professional', 'Lighting'],
            chapters: [
              { title: 'Module 1: The Foundations of Light & Vision', lessons: [{ title: '1.1 The Nature of Light', video: '/lessons/1.1.mp4' }] }
            ],
          }];
        }

        for (const c of coursesToMigrate) {
          const course = this.courseRepository.create({
            ...c,
            chapters: c.chapters.map(ch => ({
              ...ch,
              lessons: ch.lessons.map(l => ({ ...l }))
            }))
          });
          await this.courseRepository.save(course);
        }
        console.log(`Successfully migrated ${coursesToMigrate.length} courses to SQLite.`);
      } catch (error) {
        console.error('Migration failed:', error);
      }
    }
  }

  async getCourses() {
    return this.courseRepository.find({
      relations: ['chapters', 'chapters.lessons'],
    });
  }

  async upsertCourse(courseData: any) {
    // If it has an ID, we update. If not, create.
    if (courseData.id) {
       return await this.courseRepository.save(courseData);
    } else {
      const nested = this.courseRepository.create(courseData);
      return await this.courseRepository.save(nested);
    }
  }

  async deleteCourse(id: number) {
    return await this.courseRepository.delete(id);
  }
}
