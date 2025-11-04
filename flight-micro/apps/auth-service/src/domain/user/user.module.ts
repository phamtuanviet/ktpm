import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RmqModule } from 'src/rbmq/rmq.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [RedisModule, PrismaModule, RmqModule.register('logging-queue')],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
