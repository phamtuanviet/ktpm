import { Module } from '@nestjs/common';
import { FlightSeatController } from './flightSeat.controller';
import { FlightSeatRepository } from './flightSeat.repository';
import { FlightSeatService } from './flightSeat.service';
import { FlightSeatSagaHandle } from './flightSeat.saga.handle';

@Module({
  imports: [],
  controllers: [FlightSeatController, FlightSeatSagaHandle],
  providers: [FlightSeatRepository, FlightSeatService],
  exports: [FlightSeatService],
})
export class FlightSeatModule {}
