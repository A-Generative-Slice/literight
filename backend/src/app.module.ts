import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProgressModule } from './progress/progress.module';
import { CoursesModule } from './courses/courses.module';
import { UploadsModule } from './uploads/uploads.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Course } from './courses/entities/course.entity';
import { Chapter } from './courses/entities/chapter.entity';
import { Lesson } from './courses/entities/lesson.entity';
import { Progress } from './progress/entities/progress.entity';

import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/lms.db',
      entities: [Course, Chapter, Lesson, Progress, User],
      synchronize: true, // Auto-create tables for now
    }),
    ProgressModule, 
    CoursesModule, 
    UploadsModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
