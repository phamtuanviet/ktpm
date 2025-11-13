import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoggingService } from 'src/log/logging.service';

@Injectable()
export class AircraftService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly logginService: LoggingService,
  ) {}
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
    try {
      const result = await this.proxyService.forward(
        req,
        `${this.aircraftPort}`,
      );
      this.logginService.log('Aircraft created successfully', {
        body: result.aircraft,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error creating aircraft', {
        error,
        body: req.body,
      });
      error._logged = true;
      throw error;
    }
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
    try {
      const result = await this.proxyService.forward(
        req,
        `${this.aircraftPort}/${req.params.id}`,
      );
      this.logginService.log('Aircraft updated successfully', {
        body: result.aircraft,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error updating aircraft', {
        error,
        body: { ...req.body, id: req.params.id },
      });
      error._logged = true;
      throw error;
    }
  }

  async deleteAircraft(@Req() req: Request) {
    try {
      const result = await this.proxyService.forward(
        req,
        `${this.aircraftPort}/${req.params.id}`,
      );
      this.logginService.log('Aircraft deleted successfully', {
        body: { ...result.aircraft, id: req.params.id },
      });
      return result;
    } catch (error) {
      this.logginService.error('Error deleting aircraft', {
        error,
        body: req.body,
      });
      error._logged = true;
      throw error;
    }
  }

  async countAircrafts(@Req() req: Request) {
    return await this.proxyService.forward(req, `${this.aircraftPort}/count`);
  }
}
