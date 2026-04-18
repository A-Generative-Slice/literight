import { Controller, Get, Post, Body, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/enroll')
  enroll(@Param('id') id: string, @Req() req: any) {
    return this.coursesService.enrollUser(req.user.sub, +id);
  }
}
