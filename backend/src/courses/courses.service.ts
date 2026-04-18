import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Course } from './entities/course.entity';
import { Chapter } from './entities/chapter.entity';
import { Lesson } from './entities/lesson.entity';
import { User } from '../auth/entities/user.entity';

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
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
                title: 'Module 1: Introduction to the World of Lighting Design', 
                objective: 'Welcome to the masterclass, introduction to the instructor, and an overview of the curriculum and influences.',
                lessons: [
                  { title: '1.1 Presentation', duration: '14 mins', description: 'Welcome to Lighting Design for Interior Spaces, career journey, and the culture of light.' },
                  { title: '1.2 Influences', duration: '13 mins', description: 'Exploring artists and designers working with light (James Turrell, Olafur Eliasson, etc.)' },
                  { title: '1.3 What Will We Do on the Course?', duration: '3 mins', description: 'Overview of conceptualization, technique, documentation, and the final project.' }
                ] 
              },
              { 
                title: 'Module 2: Understanding Light & Perception', 
                objective: 'Delve into the physics of light, how the human eye perceives it, and its interaction with materials.',
                lessons: [
                  { title: '2.1 What Is Light?', duration: '11 mins', description: 'The electromagnetic spectrum, visible light, and photopic vs. scotopic vision.' },
                  { title: '2.2 The Subject, Observer', duration: '8 mins', description: 'How age, culture, and ocular health affect our perception of light and darkness.' },
                  { title: '2.3 Light, Materials, Objects', duration: '11 mins', description: 'Reflection, refraction, transmission, and the perception of color and volume.' }
                ] 
              },
              { 
                title: 'Module 3: Conceptualization & Methodology', 
                objective: 'Learn to construct lighting narratives, identify hierarchies, and apply structured methodologies.',
                lessons: [
                  { title: '3.1 The Concept', duration: '11 mins', description: 'The "black box" methodology, sensory concepts, and functional requirements.' },
                  { title: '3.2 Composition', duration: '10 mins', description: 'Richard Kelly’s three types of playing with light (ambient, focal, brilliants).' },
                  { title: '3.3 Layers and Hierarchies', duration: '6 mins', description: 'Ordering light layers based on the functional and aesthetic needs of the space.' }
                ] 
              },
              { 
                title: 'Module 4: Light Sources & Documentation', 
                objective: 'Technical implementation, selecting the right fixtures, and correctly defining and communicating specifications.',
                lessons: [
                  { title: '4.1 Light Sources', duration: '12 mins', description: 'History of light sources, from fire to LEDs, and understanding how they work.' },
                  { title: '4.2 How to Choose a Light Source (Part 1)', duration: '13 mins', description: 'Power, flux, efficacy, and defining the qualitative aspects of light (CCT & CRI).' },
                  { title: '4.3 How to Choose a Light Source (Part 2)', duration: '8 mins', description: 'Optics, beam angles, IP ratings, and the anatomical parts of a luminaire.' },
                  { title: '4.4 Drawing the Light', duration: '17 mins', description: 'Architectural documentation, creating RCPs, drawing symbols, and control channels.' },
                  { title: '4.5 Representation of Light Sources', duration: '8 mins', description: 'Graphical execution and creating the final presentation deliverables for the client.' }
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

  async enrollUser(userId: number, courseId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['enrolledCourses'] });
    if (!user) throw new Error('User not found');
    
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) throw new Error('Course not found');
    
    if (!user.enrolledCourses) user.enrolledCourses = [];
    
    // Check if already enrolled
    if (!user.enrolledCourses.find(c => c.id === courseId)) {
      user.enrolledCourses.push(course);
      await this.userRepository.save(user);
    }
    
    return { success: true };
  }
}
