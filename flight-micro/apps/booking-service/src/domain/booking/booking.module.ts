import { Module } from '@nestjs/common';
import { FlightSeatService } from '../flightSeat/flightSeat.service';
import { TicketService } from '../ticket/ticket.service';
import { PassengerService } from '../passenger/passenger.service';
import { BookingController } from './booking.controller';
import { FlightSeatModule } from '../flightSeat/flightSeat.module';
import { TicketModule } from '../ticket/ticket.module';
import { PassengerModule } from '../passenger/passenger.module';
import { BookingService } from './booking.service';

@Module({
  imports: [FlightSeatModule, TicketModule, PassengerModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
