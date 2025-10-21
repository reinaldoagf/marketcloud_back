import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!, // 👈 nunca será undefined
    });
  }

  async validate(payload: JwtPayload) {
    // payload contiene lo que pusiste en sign() (ej: { sub: userId, email })
    return {
      sub: payload.sub, // o payload.id si usas otro campo
      email: payload.email,
      name: payload.name,
    };
  }
}
