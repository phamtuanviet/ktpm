import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenRepository } from './refreshToken.repository';
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { SharedRabbitModule } from 'src/rbmq/shared-rabbit.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    SharedRabbitModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    RefreshTokenRepository,
    GoogleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
