import { Module } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { SharedRabbitModule } from './rbmq/shared-rabbit.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SharedRabbitModule,
    PrismaModule,
    RedisModule,
  ],
})
export class AppModule {}
