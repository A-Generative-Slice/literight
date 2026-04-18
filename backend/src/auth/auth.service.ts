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

  async signup(username: string, pass: string) {
    if (!username || !pass) throw new UnauthorizedException('Please provide both email and password.');
    
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new UnauthorizedException('Account already exists. Please log in.');
    }
    
    // New user
    user = this.userRepository.create({ 
      username, 
      passwordHash: this.hashPassword(pass),
      role: 'student', 
      isVerified: false 
    });
    await this.userRepository.save(user);

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await this.userRepository.save(user);
    await this.emailService.sendOtp(user.username, otp);
    
    return { requiresVerification: true, email: user.username, context: 'signup' };
  }

  async login(username: string, pass: string) {
    if (!username || !pass) throw new UnauthorizedException('Please provide both email and password.');

    // 1. Maintain 'Admin/Admin' requirement
    if (username === 'Admin' && pass === 'Admin') {
      let admin = await this.userRepository.findOne({ where: { username: 'Admin' } });
      if (!admin) {
        admin = this.userRepository.create({ username: 'Admin', role: 'admin', isVerified: true });
        await this.userRepository.save(admin);
      }
      return this.generateToken(admin);
    }
    
    // 2. Student Login
    let user = await this.userRepository.findOne({ where: { username }, relations: ['enrolledCourses'] });
    
    if (!user) {
      throw new UnauthorizedException('Account not found. Please sign up for a new account.');
    } 
    
    // Verify password
    if (user.passwordHash && user.passwordHash !== this.hashPassword(pass)) {
      throw new UnauthorizedException('Wrong password. Please try again or use Forgot Password.');
    }

    if (!user.isVerified) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await this.userRepository.save(user);
      await this.emailService.sendOtp(user.username, otp);
      
      return { requiresVerification: true, email: user.username, context: 'login' };
    }

    return this.generateToken(user);
  }

  async forgotPasswordRequest(email: string) {
    const user = await this.userRepository.findOne({ where: { username: email } });
    if (!user) {
      throw new UnauthorizedException('Account not found.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await this.userRepository.save(user);
    await this.emailService.sendOtp(user.username, otp);

    return { success: true, email: user.username };
  }

  async forgotPasswordReset(email: string, code: string, newPass: string) {
    const user = await this.userRepository.findOne({ where: { username: email } });
    if (!user || user.otpCode !== code || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }

    user.passwordHash = this.hashPassword(newPass);
    user.isVerified = true; // implicit verification if resetting password via email
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await this.userRepository.save(user);

    return { success: true };
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.userRepository.findOne({ where: { username: email }, relations: ['enrolledCourses'] });
    if (!user || user.otpCode !== code || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await this.userRepository.save(user);

    // Fire welcome email async (don't await — don't block login)
    this.emailService.sendWelcome(user.username).catch(() => {});

    return this.generateToken(user);
  }

  async updateProfile(userId: number, body: any) {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['enrolledCourses'] });
    if (!user) throw new UnauthorizedException('User not found');
    
    if (body.name !== undefined) user.name = body.name;
    if (body.dp !== undefined) user.dp = body.dp;

    await this.userRepository.save(user);
    return this.generateToken(user); // Send refresh token payload
  }

  private generateToken(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        id: user.id,
        username: user.username, 
        role: user.role,
        name: user.name || user.username.split('@')[0],
        dp: user.dp,
        isPremium: user.isPremium,
        enrolledCourseIds: user.enrolledCourses?.map(c => c.id) || []
      }
    };
  }
}
