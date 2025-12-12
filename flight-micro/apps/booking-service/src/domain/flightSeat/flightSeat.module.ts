import { Module } from '@nestjs/common';
import { FlightSeatController } from './flightSeat.controller';
import { FlightSeatRepository } from './flightSeat.repository';
import { FlightSeatService } from './flightSeat.service';
import { FlightSeatSagaHandle } from './flightSeat.saga.handle';
import { SharedRabbitModule } from 'src/rbmq/shared-rabbit.module';

@Module({
  imports: [SharedRabbitModule],
  controllers: [FlightSeatController],
  providers: [FlightSeatRepository, FlightSeatService, FlightSeatSagaHandle],
  exports: [FlightSeatService],
})
export class FlightSeatModule {}
