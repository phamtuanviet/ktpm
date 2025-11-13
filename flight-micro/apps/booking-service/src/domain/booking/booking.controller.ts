import { Body, Controller, HttpException, Post, Req } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import type { Request } from 'express';

@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('booking-sign')
  async bookingSign(@Req() req: Request) {
    let user = null;

    const userHeader = req?.headers['x-user'];
    if (userHeader) {
      try {
        user = JSON.parse(userHeader as string);
        return this.bookingService.signBuyTickets((user as any).email);
      } catch (error) {
        console.error('Invalid x-user header:', error);
      }
    }
    return new HttpException('Unauthorized', 401);
  }

  @Post('booking-verify')
  async bookingVerify(@Body() dto: CreateBookingDto, @Req() req: Request) {
    let user = null;
    const userHeader = req?.headers['x-user'];
    if (userHeader) {
      try {
        user = JSON.parse(userHeader as string);
        return this.bookingService.buyTickets(dto, (user as any).email);
      } catch (error) {
        console.error('Invalid x-user header:', error);
      }
    }
    return new HttpException('Unauthorized', 401);
  }
}
