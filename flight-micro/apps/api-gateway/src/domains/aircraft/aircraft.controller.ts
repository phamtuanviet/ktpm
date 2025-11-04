import { Controller, Get, Post, Put, Req, Res } from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import type { Request, Response } from 'express';

@Controller('api/aircraft')
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Get(':id')
  async getAircraft(@Req() req: Request, @Res() res: Response) {
    const { aircraft } = await this.aircraftService.getAircraftById(req);
    return res.json({
      aircraft,
      success: true,
    });
  }

  @Get('aircrafts-flight-admin/:q')
  async getAircraftsFlightAdmin(@Req() req: Request, @Res() res: Response) {
    const { aircrafts } =
      await this.aircraftService.getAircraftsFlightAdmin(req);
    return res.json({
      aircrafts,
      success: true,
    });
  }

  @Get('aircrafts-admin')
  async getAircraftsForAdmin(@Req() req: Request, @Res() res: Response) {
    const { aircrafts, totalPages, currentPage } =
      await this.aircraftService.getAircraftsForAdmin(req);
    return res.json({
      aircrafts,
      totalPages,
      currentPage,
      success: true,
    });
  }

  @Get('aircrafts-filter-admin')
  //filter
  async getAircraftsByFilterForAdmin(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { aircrafts, totalPages, currentPage } =
      await this.aircraftService.getAircraftsByFilterForAdmin(req);
    return res.json({
      aircrafts,
      totalPages,
      currentPage,
      success: true,
    });
  }

  @Post('')
  async createAircraft(@Req() req: Request, @Res() res: Response) {
    const { aircraft } = await this.aircraftService.createAircraft(req);
    return res.json({
      aircraft,
      success: true,
      message: 'Create Aircraft Successfully',
    });
  }

  @Put('')
  async updateAircraft(@Req() req: Request, @Res() res: Response) {
    const { aircraft } = await this.aircraftService.updateAircraft(req);
    return res.json({
      aircraft,
      success: true,
      message: 'Update Aircraft Successfully',
    });
  }

  @Put('delete')
  async deleteAircraft(@Req() req: Request, @Res() res: Response) {
    const { aircraft } = await this.aircraftService.deleteAircraft(req);
    return res.json({
      success: true,
      message: 'Delete aircraft successfully',
    });
  }

  @Get('count')
  // /count-aircrafts
  async countAircrafts(@Req() req: Request, @Res() res: Response) {
    const { count } = await this.aircraftService.countAircrafts(req);
    return res.json({
      count,
      success: true,
    });
  }
}
