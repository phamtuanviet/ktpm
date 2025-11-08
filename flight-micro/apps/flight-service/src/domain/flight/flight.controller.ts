import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { FlightService } from './flight.service';
import { SearchFlightDto } from './dto/searchFlight.dto';
import { FilterFlightDto } from './dto/filterFlight.dto';
import { SearchFlightForUserDto } from './dto/searchFlightForUser.dto';
import { CreateFlightDto } from './dto/createFlight.dto';
import { UpdateFlightDto } from './dto/updateFlight.dto';
import { FlightForTicketsDto } from './dto/flightsForTickets.dto';

@Controller('api/flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Get('flights-ticket-admin/:q')
  ///search-flights-in-ticket
  async getFlightsTicketAdmin(@Param('q') q: string) {
    return await this.flightService.getFlightsInTicketForAdmin(q);
  }

  @Get('flights-tickets-admin')
  async getFlightsInTicketsForAdmin(@Query() query: FlightForTicketsDto) {
    return await this.flightService.getFlightsInTicketsForAdmin(query);
  }

  @Get('flights-admin')
  ///get-flights-by-search
  async getFlightsAdmin(@Query() query: SearchFlightDto) {
    return await this.flightService.getFlightsAdmin(query);
  }

  @Get('flights-filter-admin')
  async getFlightsFilterForAdmin(@Query() query: FilterFlightDto) {
    return await this.flightService.getFlightsFilterForAdmin(query);
  }

  @Get('flights-client')
  async getFlightsForClient(@Query() query: SearchFlightForUserDto) {
    return await this.flightService.getFlightsForClient(query);
  }

  @Post('')
  async createFlight(@Body() createFlightDto: CreateFlightDto) {
    return await this.flightService.createFlight(createFlightDto);
  }

  @Put('/:id')
  async updateFlight(@Body() dto: UpdateFlightDto, @Param('id') id: string) {
    console.log(id, dto);
    return await this.flightService.updateFlight(id, dto);
  }

  @Get('count')
  async countFlights() {
    return await this.flightService.countFlights();
  }

  @Get('count-status')
  async countStatusFlights() {
    return await this.flightService.countStatusFlights();
  }

  @Get(':id')
  async getFlightById(@Param('id') id: string) {
    return await this.flightService.getFlightById(id);
  }
}
