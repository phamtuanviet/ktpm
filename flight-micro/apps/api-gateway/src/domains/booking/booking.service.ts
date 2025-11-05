import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';

@Injectable()
export class BookingService {
  constructor(private readonly proxyService: ProxyService) {}

  private readonly baseUrl = SERVICES.BOOKING_SERVICE + 'api/booking';

  async bookingSign(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/booking-sign');
  }

  async bookingVerify(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      this.baseUrl + '/booking-verify',
    );
  }
}
