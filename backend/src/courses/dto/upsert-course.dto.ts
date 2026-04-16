import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LessonDto {
  @IsOptional() @IsNumber() id?: number;
  @IsString() title: string;
  @IsOptional() @IsString() video?: string;
  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() sourceMaterial?: string;
}

export class ChapterDto {
  @IsOptional() @IsNumber() id?: number;
  @IsString() title: string;
  @IsOptional() @IsString() objective?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => LessonDto) lessons?: LessonDto[];
  @IsOptional() @IsArray() quiz?: any[];
}

export class UpsertCourseDto {
  @IsOptional() @IsNumber() id?: number;
  @IsString() title: string;
  @IsOptional() @IsString() instructor?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() trailer?: string;
  @IsOptional() @IsString() thumbnail?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsNumber() originalPrice?: number;
  @IsOptional() @IsNumber() passPercentage?: number;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ChapterDto) chapters?: ChapterDto[];
}
