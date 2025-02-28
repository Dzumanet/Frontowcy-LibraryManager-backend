import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import * as process from 'process';
import { JwtUserDto } from './dto/jwt-user.dto';

export type JwtPayload = JwtUserDto;

function cookieExtractor(req: any): null | string {
    return req && req.cookies ? (req.cookies?.jwt ?? null) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: cookieExtractor,
            secretOrKey: process.env.JWT_KEY,
        } as StrategyOptionsWithRequest);
    }

    async validate(
        payload: JwtPayload,
        done: (error: any, user?: any) => void,
    ) {
        try {
            if (!payload || !payload.id) {
                return done(new UnauthorizedException(), false);
            }
            const user = await UserEntity.findOne({
                where: { currentTokenId: payload.id },
            });
            if (!user) {
                return done(new UnauthorizedException(), false);
            }

            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
}
