import { Module } from '@nestjs/common';
import { AirportController } from './airport.controller';
import { AirportService } from './airport.service';
import { AirportRepository } from './airport.repository';

@Module({
  imports: [],
  controllers: [AirportController],
  providers: [AirportService, AirportRepository],
  exports: [AirportService],
})
export class AirportModule {}
