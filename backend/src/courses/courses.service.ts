import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class CoursesService implements OnModuleInit {
  private readonly dataPath = path.join(process.cwd(), 'data', 'courses.json');
  private courses: any[] = [];

  onModuleInit() {
    this.ensureDataDirectory();
    this.loadCourses();
  }

  private ensureDataDirectory() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadCourses() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, 'utf8');
        this.courses = JSON.parse(data);
      } else {
        // Initial template if no file exists
        this.courses = [{
          id: 1,
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
            { id: 101, title: 'Module 1: The Foundations of Light & Vision', lessons: [{ id: 1011, title: '1.1 The Nature of Light', video: '/lessons/1.1.mp4' }], quiz: [] }
          ],
        }];
        this.saveToFile();
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      this.courses = [];
    }
  }

  private saveToFile() {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.courses, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  }

  getCourses() {
    return this.courses;
  }

  upsertCourse(courseData: any) {
    const index = this.courses.findIndex(c => c.id === courseData.id);
    if (index !== -1) {
      this.courses[index] = courseData;
    } else {
      this.courses.push(courseData);
    }
    this.saveToFile();
    return courseData;
  }
}
