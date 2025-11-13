import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { SharedRabbitModule } from 'src/rbmq/shared-rabbit.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [SharedRabbitModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
