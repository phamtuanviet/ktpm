import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { FlightController } from './flight.controller';
import { FlightRepository } from './flight.repository';
import { AirportService } from '../airport/airport.service';
import { AircraftService } from '../aircraft/aircraft.service';
import { AircraftModule } from '../aircraft/aircraft.module';
import { AirportModule } from '../airport/airport.module';
import { FlightSagaHandler } from './flight.saga.handler';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { SharedRabbitModule } from 'src/rbmq/shared-rabbit.module';
import { ScheduleModule } from '@nestjs/schedule';
import { FlightCronService } from './flight.cron.service';

@Module({
  imports: [
    AircraftModule,
    AirportModule,
    SharedRabbitModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [FlightController],
  providers: [
    FlightService,
    FlightRepository,
    FlightSagaHandler,
    FlightCronService,
  ],
  exports: [FlightService],
})
export class FlightModule {}
