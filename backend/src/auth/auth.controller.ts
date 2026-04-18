import { Controller, Post, Body, UnauthorizedException, UseGuards, Patch, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    return this.authService.signup(body.username, body.password);
  }

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

  @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    return this.authService.forgotPasswordRequest(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    return this.authService.forgotPasswordReset(body.email, body.code, body.newPassword);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.sub, body);
  }
}
