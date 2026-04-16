import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UpsertCourseDto } from './dto/upsert-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.getCourses();
  }

  @Post()
  upsert(@Body() courseData: UpsertCourseDto) {
    return this.coursesService.upsertCourse(courseData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.deleteCourse(+id);
  }
}
