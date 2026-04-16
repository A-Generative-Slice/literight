import { Controller, Get, Post, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.getCourses();
  }

  @Post()
  upsert(@Body() courseData: any) {
    return this.coursesService.upsertCourse(courseData);
  }
}
