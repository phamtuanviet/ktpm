import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { FlightRepository } from './flight.repository';
import { AirportService } from '../airport/airport.service';
import { AircraftService } from '../aircraft/aircraft.service';

@Module({
  imports: [],
  controllers: [FlightController],
  providers: [FlightService, FlightRepository, AirportService,AircraftService],
})
export class FlightModule {}
