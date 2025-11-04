import { Controller, Get, Param } from '@nestjs/common';
import { AirportService } from './airport.service';

@Controller('api/airport')
export class AirportController {
  // Controller logic for airport management would go here
  constructor(private readonly airportService: AirportService) {}

  @Get('airports-client/:q')
  ///search-airports
  async getAirportsForClient(@Param('q') q: string) {
    return this.airportService.getAirportsForClient(q);
  }

  @Get('airports-flight-admin/:q')
  async getAirportsInFlightForAdmin(@Param('q') q: string) {
    return this.airportService.getAirportsInFlightForAdmin(q);
  }

  
}
