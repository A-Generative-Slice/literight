import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('update')
  updateProgress(
    @Body('userId') userId: string,
    @Body('lessonId') lessonId: string,
    @Body('timestamp') timestamp: number,
    @Body('completed') completed: boolean,
  ) {
    return this.progressService.saveProgress(userId, lessonId, timestamp, completed);
  }

  @Get('status')
  getStatus(
    @Query('userId') userId: string, 
    @Query('lessonId') lessonId: string
  ) {
    return this.progressService.getProgress(userId, lessonId);
  }
}
