import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import { SearchAircraftDto } from './dto/searchAircarft.dto';
import { FilterAircraftDto } from './dto/filterAircraft.dto';
import { CreateAircraftDto } from './dto/createAircraft.dto';
import { UpdateAircraftDto } from './dto/updateAircraft.dto';
import { DeleteAircraftDto } from './dto/deleteAircraft.dto';

@Controller('api/aircraft')
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Get(':id')
  async getAircraft(@Param('id') id: string) {
    return await this.aircraftService.getAircraftById(id);
  }

  @Get('aircrafts-flight-admin/:q')
  //search-aircraft-flight/:q
  async getAircraftInFlight(@Param('q') q: string) {
    return await this.aircraftService.getAircraftsInFlight(q);
  }

  @Get('aircrafts-admin')
  ///get-aircrafts-by-search
  async getAircraftsForAdmin(@Query() query: SearchAircraftDto) {
    return await this.aircraftService.getAircraftsForAdmin(query);
  }

  @Get('aircrafts-filter-admin')
  //filter
  async getAircraftsByFilterForAdmin(@Query() query: FilterAircraftDto) {
    return await this.aircraftService.getAircraftsByFilterForAdmin(query);
  }

  @Post('')
  async createAircraft(@Body() createAircraftDto: CreateAircraftDto) {
    return await this.aircraftService.createAircraft(createAircraftDto);
  }

  @Put('')
  async updateAircraft(@Body() dto: UpdateAircraftDto) {
    return await this.aircraftService.updateAircraft(dto);
  }

  @Put('delete')
  async deleteAircraft(@Body() dto: DeleteAircraftDto) {
    return await this.aircraftService.deleteAircraft(dto.id);
  }

  @Get('count')
  // /count-aircrafts
  async countAircrafts() {
    return await this.aircraftService.countAircrafts();
  }
}
