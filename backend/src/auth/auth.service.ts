import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { EmailService } from './email.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async login(username: string, pass: string) {
    // 1. Maintain 'Admin/Admin' requirement
    if (username === 'Admin' && pass === 'Admin') {
      let admin = await this.userRepository.findOne({ where: { username: 'Admin' } });
      if (!admin) {
        admin = this.userRepository.create({ username: 'Admin', role: 'admin', isVerified: true });
        await this.userRepository.save(admin);
      }
      return this.generateToken(admin);
    }
    
    // 2. Persistent Student Login & Password Validations
    let user = await this.userRepository.findOne({ where: { username } });
    
    if (!user) {
      // Create new student
      user = this.userRepository.create({ 
        username, 
        passwordHash: this.hashPassword(pass),
        role: 'student', 
        isVerified: false 
      });
      await this.userRepository.save(user);
    } else {
      // Verify existing student's password
      if (user.passwordHash && user.passwordHash !== this.hashPassword(pass)) {
        throw new UnauthorizedException('Invalid credentials provided.');
      }
      // If updating from an old account that lacks a hash, save the new one
      if (!user.passwordHash) {
        user.passwordHash = this.hashPassword(pass);
        await this.userRepository.save(user);
      }
    }

    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otp;
      user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      await this.userRepository.save(user);
      await this.emailService.sendOtp(user.username, otp);
      
      return { requiresVerification: true, email: user.username };
    }

    return this.generateToken(user);
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.userRepository.findOne({ where: { username: email } });
    if (!user || user.otpCode !== code || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await this.userRepository.save(user);

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { username: user.username, role: user.role }
    };
  }
}
