import { Module } from '@nestjs/common';
import { PassengerRepository } from './passenger.repositoty';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { SharedRabbitModule } from 'src/rbmq/shared-rabbit.module';

@Module({
  imports: [SharedRabbitModule],
  controllers: [PassengerController],
  providers: [PassengerService, PassengerRepository],
  exports: [PassengerService],
})
export class PassengerModule {}
