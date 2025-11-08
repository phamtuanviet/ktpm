import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';

@Injectable()
export class AircraftService {
  constructor(private readonly proxyService: ProxyService) {}
  private readonly aircraftPort = SERVICES.FLIGHT_SERVICE + '/api/aircraft';

  async getAircraftById(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      `${this.aircraftPort}/${req.params.id}`,
    );
  }

  async getAircraftsFlightAdmin(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      `${this.aircraftPort}/aircrafts-flight-admin/${req.params.q}`,
    );
  }

  async createAircraft(@Req() req: Request) {
    return await this.proxyService.forward(req, `${this.aircraftPort}`);
  }

  async getAircraftsForAdmin(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      `${this.aircraftPort}/aircrafts-admin/`,
    );
  }

  async getAircraftsByFilterForAdmin(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      `${this.aircraftPort}/aircrafts-filter-admin`,
    );
  }

  async updateAircraft(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      `${this.aircraftPort}/${req.params.id}`,
    );
  }

  async deleteAircraft(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      `${this.aircraftPort}/${req.params.id}`,
    );
  }

  async countAircrafts(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      `${this.aircraftPort}/count-aircrafts`,
    );
  }
}
