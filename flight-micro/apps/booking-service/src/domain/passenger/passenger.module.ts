import { Module } from '@nestjs/common';
import { PassengerRepository } from './passenger.repositoty';
import { PassengerController } from './passenger.controller';
import { PassengerService } from './passenger.service';

@Module({
  imports: [],
  controllers: [PassengerController],
  providers: [PassengerService, PassengerRepository],
})
export class PassengerModule {}
