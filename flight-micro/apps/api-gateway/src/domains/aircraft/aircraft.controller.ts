import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import type { Request, Response } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('api/aircraft')
export class AircraftController {
  constructor(
    private readonly aircraftService: AircraftService,
  ) {}

  // @Roles('ADMIN')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('aircrafts-flight-admin/:q')
  async getAircraftsFlightAdmin(@Req() req: Request, @Res() res: Response) {
    const { aircrafts } =
      await this.aircraftService.getAircraftsFlightAdmin(req);
    return res.json({
      data: aircrafts,
      success: true,
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  async createAircraft(@Req() req: Request, @Res() res: Response) {
    const { aircraft } = await this.aircraftService.createAircraft(req);
    return res.json({
      aircraft,
      success: true,
      message: 'Create Aircraft Successfully',
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('delete')
  async deleteAircraft(@Req() req: Request, @Res() res: Response) {
    const { aircraft } = await this.aircraftService.deleteAircraft(req);
    return res.json({
      success: true,
      message: 'Delete aircraft successfully',
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('/:id')
  async updateAircraft(@Req() req: Request, @Res() res: Response) {
    const { aircraft } = await this.aircraftService.updateAircraft(req);
    return res.json({
      aircraft,
      success: true,
      message: 'Update Aircraft Successfully',
    });
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('count')
  async countAircrafts(@Req() req: Request, @Res() res: Response) {
    const { count } = await this.aircraftService.countAircrafts(req);
    return res.json({
      count,
      success: true,
    });
  }

  @Get(':id')
  async getAircraft(@Req() req: Request, @Res() res: Response) {
    const { aircraft } = await this.aircraftService.getAircraftById(req);

    return res.json({
      aircraft,
      success: true,
    });
  }
}
