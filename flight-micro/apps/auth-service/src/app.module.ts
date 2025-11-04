import { Module } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { RmqModule } from './rbmq/rmq.module';

@Module({
  imports: [AuthModule, UserModule, RmqModule.register('user-booking-queue')],
})
export class AppModule {}
