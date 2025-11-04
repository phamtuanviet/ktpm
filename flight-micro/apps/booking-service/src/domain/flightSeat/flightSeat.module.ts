import { Module } from '@nestjs/common';
import { FlightSeatController } from './flightSeat.controller';
import { FlightSeatRepository } from './flightSeat.repository';
import { FlightSeatService } from './flightSeat.service';

@Module({
  imports: [],
  controllers: [FlightSeatController],
  providers: [FlightSeatRepository, FlightSeatService],
})
export class FlightSeatModule {}
