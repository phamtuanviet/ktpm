import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RedisModule } from '../../redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { RmqModule } from 'src/rbmq/rmq.module';
import { AuthRepository } from './auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenRepository } from './refreshToken.repository';
import { GoogleStrategy } from 'src/strategies/google.strategy';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
    RmqModule.register('logging-queue'),
    RmqModule.register('email-queue'),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService, AuthRepository, RefreshTokenRepository,GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
