import { Body, Controller, Post } from '@nestjs/common';
import { BookingService } from './booking.service';
import { SignBookingDto } from './dto/signBooking.dto';
import { CreateBookingDto } from './dto/createBooking.dto';

@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('booking-sign')
  async bookingSign(@Body() bookingSignDto: SignBookingDto) {
    return await this.bookingService.signBuyTickets(bookingSignDto.email);
  }

  @Post('booking-verify')
  async bookingVerify(@Body() dto: CreateBookingDto) {
    return await this.bookingService.buyTickets(dto);
  }
  
}
