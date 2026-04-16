import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(username: string, pass: string) {
    // Keeping exactly as requested: Admin / Admin credentials
    if (username === 'Admin' && pass === 'Admin') {
      const payload = { username: 'Admin', sub: 'admin-id-123', role: 'admin' };
      return {
        access_token: this.jwtService.sign(payload),
        user: { username: 'Admin', role: 'admin' }
      };
    }
    
    // For students, we'll allow any login for now but issue a token
    const payload = { username, sub: userIdMap[username] || 'student-' + Math.random(), role: 'student' };
    return {
      access_token: this.jwtService.sign(payload),
      user: { username, role: 'student' }
    };
  }
}

const userIdMap: Record<string, string> = {}; // Mock user ID persistence for the session
