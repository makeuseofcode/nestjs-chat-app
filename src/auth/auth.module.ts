import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({

  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule {}
