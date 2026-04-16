import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  objective: string;

  @Column({ type: 'simple-json', nullable: true })
  quiz: any[];

  @ManyToOne(() => Course, (course) => course.chapters, { onDelete: 'CASCADE' })
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.chapter, { cascade: true, eager: true })
  lessons: Lesson[];
}
