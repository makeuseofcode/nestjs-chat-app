import { ApiTags, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import RequestWithUser from './requestWithUser.interface';
import { AccessTokenGuard } from '../common/guards/accessToken.guard'
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard'

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiBody({
        description: 'Contains properties to create User',
        type: CreateUserDto,
        
    })
    @ApiCreatedResponse({
        status: 201,
        description: 'returns 201 status and a refresh and access token when a user successfully signs up',
    })
    @Post('signup')
    signup(@Body() createUserDto: CreateUserDto) {
      return this.authService.signUp(createUserDto);
    }


    @ApiBody({
        description: 'Contains properties login a User',
        type: AuthDto,
        
    })
    @ApiCreatedResponse({
        status: 200,
        description: 'returns 200 status and a refresh and access token when a user successfully signs in',
    })
    @Post('signin')
    signin(@Body() data: AuthDto) {
      return this.authService.signIn(data);
    }
  

    @ApiCreatedResponse({
        status: 200,
        description: 'returns 200 status and logs a user out',
    })
    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logout(@Req() req: RequestWithUser) {
      this.authService.logout(req.user['sub']);
    }

    @ApiCreatedResponse({
        status: 200,
        description: 'returns 200 status and return a refresh and access token',
    })
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refreshTokens(@Req() req: RequestWithUser) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        const data = await this.authService.refreshTokens(userId, refreshToken)
        return {
            message: 'success',
            data: {
                ...data
            }
        }
    }


    @ApiCreatedResponse({
        status: 200,
        description: 'returns 200 status current logged in User object',
    })
    @UseGuards(AccessTokenGuard)
    @Get('/me')
    getCurrentUser(@Req() req: RequestWithUser) {
        const user = req.user
        return {
            message: 'success',
            data: {
                ...user
            }
        }
    }

}
