import { Entity, PrimaryGeneratedColumn, Column, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['userId', 'lessonId'])
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  lessonId: string;

  @Column({ type: 'float', default: 0 })
  timestamp: number;

  @Column({ default: false })
  completed: boolean;

  @UpdateDateColumn()
  updatedAt: Date;
}
