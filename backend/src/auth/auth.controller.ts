import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const result = await this.authService.login(body.username, body.password);
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
}
