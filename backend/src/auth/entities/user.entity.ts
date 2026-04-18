import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ default: 'student' })
  role: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  otpCode?: string;

  @Column({ type: 'datetime', nullable: true })
  otpExpiry?: Date;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  dp?: string;

  @Column({ default: false })
  isPremium: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
