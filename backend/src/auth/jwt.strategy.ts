import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'LITERIGHT_SECRET_KEY_12345', // In production, use env vars
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, username: payload.username, role: payload.role };
  }
}
