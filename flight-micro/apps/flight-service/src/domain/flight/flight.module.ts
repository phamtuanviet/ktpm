import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { FlightRepository } from './flight.repository';
import { AirportService } from '../airport/airport.service';
import { AircraftService } from '../aircraft/aircraft.service';
import { AircraftModule } from '../aircraft/aircraft.module';
import { AirportModule } from '../airport/airport.module';
import { FlightSagaHandler } from './flight.saga.handler';

@Module({
  imports: [AircraftModule, AirportModule],
  controllers: [FlightController, FlightSagaHandler],
  providers: [FlightService, FlightRepository],
  exports: [FlightService],
})
export class FlightModule {}
