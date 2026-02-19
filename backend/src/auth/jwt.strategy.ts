import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET_KEY_DEV', // In prod use configService.get('JWT_SECRET')
        });
    }

    async validate(payload: any) {
        console.log('JWT Payload:', payload);
        return { userId: payload.sub, username: payload.username, role: payload.role };
    }
}
