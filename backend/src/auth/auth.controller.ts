import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.username, body.password);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: any) {
    const result = await this.authService.verifyOtp(body.email, body.code);
    if (!result) {
      throw new UnauthorizedException('Security code verification failed');
    }
    return result;
  }
}
