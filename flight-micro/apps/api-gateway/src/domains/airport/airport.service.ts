import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoggingService } from 'src/log/logging.service';

@Injectable()
export class AirportService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly logginService: LoggingService,
  ) {}

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
