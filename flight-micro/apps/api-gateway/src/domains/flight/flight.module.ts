import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { ProxyModule } from 'src/proxy/proxy.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ProxyModule, HttpModule],
  controllers: [FlightController],
  providers: [FlightService],
})
export class FlightModule {}
