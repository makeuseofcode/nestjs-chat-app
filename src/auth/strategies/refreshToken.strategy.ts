import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import JwtPayload from '../jwtPayload.interface';
import { Request } from 'express';


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
        return { ...payload, refreshToken }
    }
}