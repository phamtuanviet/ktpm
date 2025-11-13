import { Controller, Get, Req, Res } from '@nestjs/common';
import { AirportService } from './airport.service';
import type { Request, Response } from 'express';

@Controller('api/airport')
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get('airports-client/:q')
  ///search-airports
  async getAirportsForClient(@Req() req: Request, @Res() res: Response) {
    const { airports } = await this.airportService.getAirportsForClient(req);
    return res.json({
      data: airports,
      sucess: true,
    });
  }

  @Get('airports-flight-admin/:q')
  async getAirportsInFlightForAdmin(@Req() req: Request, @Res() res: Response) {
    const { airports } =
      await this.airportService.getAirportsInFlightForAdmin(req);
    return res.json({
      data: airports,
      sucess: true,
    });
  }
}
