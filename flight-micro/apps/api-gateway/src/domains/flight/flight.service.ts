import { HttpService } from '@nestjs/axios';
import { Injectable, Req } from '@nestjs/common';
import { SERVICES } from 'dist/config/services.config';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';

@Injectable()
export class FlightService {
  private readonly baseUrl = SERVICES.FLIGHT_SERVICE + '/api/';
  private readonly bookingUrl = SERVICES.BOOKING_SERVICE + 'api';

  constructor(private readonly proxyService: ProxyService) {}

  async createFlightByAdmin(@Req() req: Request) {
    const { flight } = await this.proxyService.forward(req, this.baseUrl + '/');
    return { flight };
  }
}
