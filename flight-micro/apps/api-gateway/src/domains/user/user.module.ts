import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProxyService } from 'src/proxy/proxy.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, ProxyService],
})
export class UserModule {}
