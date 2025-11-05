import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { BookingService } from './booking.service';

@Controller('api/booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('booking-sign')
  async bookingSign(@Req() req: Request, @Res() res: Response) {
    // TODO: Implement booking sign
    const { message } = await this.bookingService.bookingSign(req);
    return res.json({
      message,
      success: true,
    });
  }

  @Post('booking-verify')
  async bookingVerify(@Req() req: Request, @Res() res: Response) {
    const { tickets } = await this.bookingService.bookingVerify(req);
    return res.json({
      tickets,
      message: 'Booking verified successfully',
      success: true,
    });
  }
}
