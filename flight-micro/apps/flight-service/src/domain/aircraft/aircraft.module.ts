import { Module } from '@nestjs/common';
import { AircraftController } from './aircraft.controller';
import { AircraftService } from './aircraft.service';
import { AircraftRepository } from './aircraft.repository';

@Module({
  imports: [],
  controllers: [AircraftController],
  providers: [AircraftService, AircraftRepository],
  exports: [AircraftService],
})
export class AircraftModule {}
