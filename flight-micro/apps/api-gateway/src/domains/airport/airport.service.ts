import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';

@Injectable()
export class AirportService {
  constructor(private readonly proxyService: ProxyService) {}

  private readonly baseUrl = SERVICES.FLIGHT_SERVICE + '/api/airport';

  async getAirportsForClient(@Req() req: Request) {
    return this.proxyService.forward(
      req,
      `${this.baseUrl}/airports-client/${req.params.q}`,
    );
  }

  async getAirportsInFlightForAdmin(@Req() req: Request) {
    return this.proxyService.forward(
      req,
      `${this.baseUrl}/airports-flight-admin/${req.params.q}`,
    );
  }
}
