import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './../users/users.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import JwtPayload from './jwtPayload.interface';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService,
        private jwtService: JwtService
    ) {}

    async signUp(createUserDto: CreateUserDto): Promise<any> {
        const user = await this.usersService.findByEmail(createUserDto.email)

        if(user) throw new BadRequestException('User already exists')

        // hash password
        const hash = await this.hashData(createUserDto.password)
        const newUser = await this.usersService.create({
            ...createUserDto,
            password: hash
        })

        const tokens = await this.getTokens(newUser._id, newUser.email)
        await this.updateRefreshToken(newUser._id, tokens.refreshToken)
        return { ...tokens, ...user }
    }


    async signIn(authDto: AuthDto) {
        const user = await this.usersService.findByEmail(authDto.email)

        if(!user) throw new NotFoundException('User does not exist')

        const passwordMatches = await argon2.verify(user.password, authDto.password)

        if (!passwordMatches) throw new BadRequestException('Incorrect email or password')

        const tokens = await this.getTokens(user._id, user.email)
        await this.updateRefreshToken(user._id, tokens.refreshToken)
        return { ...tokens, ...user }

    }

    async logout(userId: string) {
        return this.usersService.update(userId, { refreshToken: null })
    }

    async hashData(data: string) {
        return argon2.hash(data)
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken)

        await this.usersService.update(userId, { refreshToken: hashedRefreshToken })
    }

    async getTokens(userId: string, email: string) {
        const [ accessToken, refreshToken ] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m'
                }
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d'
                }
            )
        ])

        return {
            accessToken,
            refreshToken
        }
    }


    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refreshToken)
          throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await argon2.verify(
          user.refreshToken,
          refreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user._id, user.email);
        await this.updateRefreshToken(user._id, tokens.refreshToken);
        return { ...tokens, ...user };
      
    }


    public async getUserFromAuthenticationToken(token: string) {
        const payload: JwtPayload = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        });
        
        const userId = payload.sub

        if (userId) {
            return this.usersService.findById(userId);
        }
      }
}
