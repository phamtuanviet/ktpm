import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FlightSeatService } from './flightSeat.service';
import { CreateFlightSeatsForFlightDto } from './dto/createFlighSeatForFlight.dto';
import { GetSeatsByFlightsDto } from './dto/getSeatsByFlights.dto';

@Controller('api/flight-seat')
export class FlightSeatController {
  constructor(private readonly flightSeatService: FlightSeatService) {}

  @Get('flight-seat/:id')
  async getFlightSeat(@Param('id') id: string) {
    return await this.flightSeatService.getFlightSeatById(id);
  }

  @Get('flight/:id')
  async getFlightSeats(@Param('id') id: string) {
    return await this.flightSeatService.getFlightSeatsByFlightId(id);
  }

  @Get('flight-seats-flights')
  async getFlightSeatsByFlights(@Query() dto: GetSeatsByFlightsDto) {
    return await this.flightSeatService.getFlightSeatsByFlights(dto);
  }

  @Post('flight-seats-flight')
  async getFlightSeatsByFlightId(@Body() dto: CreateFlightSeatsForFlightDto) {
    return await this.flightSeatService.createFlightSeatsForFlight(dto);
  }
}
