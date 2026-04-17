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
            instructor: 'Litelab Experts',
            trailer: '/trailer.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
            passPercentage: 80,
            price: 199, originalPrice: 299,
            rating: 4.9, students: 1247,
            duration: '3h 0m', totalLessons: 22,
            description: 'Master the art and science of architectural lighting. This industry-grade curriculum covers physics, human perception, architectural principles, and real-world frameworks for residential and commercial spaces.',
            tags: ['Architecture', 'Professional', 'Lighting'],
            chapters: [
              { 
                title: 'Module 1: The Foundations of Light & Vision', 
                objective: 'Understand the physics of light, how the human eye perceives it, and the scientific metrics used to measure it.',
                lessons: [
                  { title: '1.1 The Nature of Light', duration: '10 mins', description: 'The electromagnetic spectrum, visible light, and behaviors like reflection and refraction.' },
                  { title: '1.2 Human Vision & Perception', duration: '15 mins', description: 'Structure of the eye, visual modes, and color perception.' },
                  { title: '1.3 Scientific Metrics & Photometry', duration: '20 mins', description: 'Lumen, lux, candela, CRI, and TM-30 measurement tools.' }
                ] 
              },
              { 
                title: 'Module 2: Architectural Lighting & Visual Comfort', 
                objective: 'Learn the core principles of lighting design, layers of light, and how to ensure spaces are visually comfortable.',
                lessons: [
                  { title: '2.1 Principles of Lighting Design', duration: '15 mins', description: 'Richard Kelly’s three elements of light and layering techniques.' },
                  { title: '2.2 Visual Comfort & Ergonomics', duration: '15 mins', description: 'Understanding glare (UGR), contrast ratios, and surface reflectance.' },
                  { title: '2.3 Spatial Perspectives', duration: '15 mins', description: 'Natural vs. artificial light and biophilic design integration.' }
                ] 
              },
              { 
                title: 'Module 3: Human Centric Lighting (HCL) & Psychology', 
                objective: 'Explore how light biologically and psychologically impacts human health, mood, and productivity.',
                lessons: [
                  { title: '3.1 Biological Impact of Light', duration: '15 mins', description: 'Circadian rhythms and non-visual effects of light.' },
                  { title: '3.2 The Psychology of Light and Color', duration: '15 mins', description: 'Environmental cognition and emotional responses to colors.' },
                  { title: '3.3 Implementing HCL', duration: '15 mins', description: 'Translating biological needs into dynamic lighting design.' }
                ] 
              },
              { 
                title: 'Module 4: The Environmental Lighting Framework', 
                objective: 'Apply foundational and psychological principles to real-world environments using a space-by-space framework.',
                lessons: [
                  { title: '4.1 Framework for Residential Spaces', duration: '20 mins', description: 'Maximizing space in apartments and creating drama in luxury villas.' },
                  { title: '4.2 Framework for Outdoor & Transitional Spaces', duration: '10 mins', description: 'Terraces, balconies, and landscape facade textures.' },
                  { title: '4.3 Framework for Commercial Workspaces', duration: '15 mins', description: 'Designing for productivity, glare-free task lighting, and business scene-setting.' }
                ] 
              }
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
      order: {
        chapters: {
          id: 'ASC',
          lessons: {
            id: 'ASC'
          }
        }
      }
    });
  }

  async upsertCourse(courseData: any) {
    if (courseData.id) {
      // For updates, we use preload to merge changes including relations
      const course = await this.courseRepository.preload(courseData);
      if (!course) throw new Error(`Course #${courseData.id} not found`);
      return await this.courseRepository.save(course);
    } else {
      const nested = this.courseRepository.create(courseData);
      return await this.courseRepository.save(nested);
    }
  }

  async deleteCourse(id: number) {
    return await this.courseRepository.delete(id);
  }
}
