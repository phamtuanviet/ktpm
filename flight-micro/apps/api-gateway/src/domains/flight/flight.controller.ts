import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import type { Request, Response } from 'express';
import { SERVICES } from 'src/config/services.config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('/api/flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}
  private readonly baseUrl = SERVICES.FLIGHT_SERVICE + '/api/flight';

  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  async createFlightByAdmin(@Req() req: Request, @Res() res: Response) {
    const { flight } = await this.flightService.createFlightByAdmin(req);
    return res.json({
      flight,
      sucesss: true,
      message: 'Flight request create successfully',
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:id')
  async updateFlight(@Req() req: Request, @Res() res: Response) {
    const { flight } = await this.flightService.updateFlight(req);
    return res.json({
      flight,
      sucesss: true,
      message: 'Flight request update successfully',
    });
  }

  @Get('flights-ticket-admin/:q')
  ///search-flights-in-ticket
  async getFlightsTicketAdmin(@Req() req: Request, @Res() res: Response) {
    const { flights } =
      await this.flightService.getFlightsInTicketForAdmin(req);
    return res.json({
      flights,
      sucesss: true,
    });
  }

  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('flights-admin')
  ///get-flights-by-search
  async getFlightsAdmin(@Req() req: Request, @Res() res: Response) {
    const { flights, totalPages, currentPage } =
      await this.flightService.getFlightsAdmin(req);
    return res.json({
      flights,
      totalPages,
      currentPage,
      sucesss: true,
    });
  }

  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('flights-filter-admin')
  async getFlightsFilterForAdmin(@Req() req: Request, @Res() res: Response) {
    const { flights, totalPages, currentPage } =
      await this.flightService.getFlightsFilterForAdmin(req);
    return res.json({
      flights,
      totalPages,
      currentPage,
      sucesss: true,
    });
  }


  @Get('flights-client')
  async getFlightsForClient(@Req() req: Request, @Res() res: Response) {
    const { outbound, inbound } =
      await this.flightService.getFlightsForClient(req);
    return res.json({
      outbound,
      inbound,
      sucesss: true,
    });
  }

  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('count')
  async countFlights(@Req() req: Request, @Res() res: Response) {
    const { count } = await this.flightService.countFlights(req);
    return res.json({
      count,
      sucesss: true,
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('count-status')
  async countStatusFlights(@Req() req: Request, @Res() res: Response) {
    const { count } = await this.flightService.countStatusFlights(req);
    return res.json({
      count,
      sucesss: true,
    });
  }


  @Get(':id')
  async getFlightById(@Req() req: Request, @Res() res: Response) {
    const { flight } = await this.flightService.getFlightById(req);
    return res.json({
      flight,
      sucesss: true,
    });
  }
}
