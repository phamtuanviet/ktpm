import { Module } from '@nestjs/common';
import { FlightSeatService } from '../flightSeat/flightSeat.service';
import { TicketService } from '../ticket/ticket.service';
import { PassengerService } from '../passenger/passenger.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [],
  controllers: [BookingController],
  providers: [FlightSeatService, TicketService, PassengerService],
})
export class BookingModule {}
