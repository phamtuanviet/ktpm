import { Controller, Post, Req, Res } from '@nestjs/common';
import { SERVICES } from 'dist/config/services.config';
import { FlightService } from './flight.service';
import type { Request, Response } from 'express';

@Controller('/api/flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}
  private readonly baseUrl = SERVICES.FLIGHT_SERVICE + '/api/flight';

  @Post('')
  async createFlightByAdmin(@Req() req: Request, @Res() res: Response) {
    const { flight } = await this.flightService.createFlightByAdmin(req);
    return res.json({
      flight,
      sucesss: true,
      message: 'Flight request create successfully',
    });
  }
}
