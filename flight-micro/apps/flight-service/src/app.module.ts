import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { AircraftModule } from './domain/aircraft/aircraft.module';
import { PrismaModule } from './prisma/prisma.module';
import { AirportModule } from './domain/airport/airport.module';
import { RedisModule } from './redis/redis.module';
import { FlightModule } from './domain/flight/flight.module';
import { HttpModule } from '@nestjs/axios';

import { SharedRabbitModule } from './rbmq/shared-rabbit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedRabbitModule,
    // RmqBindingModule,
    AircraftModule,
    AirportModule,
    FlightModule,
    PrismaModule,
    // RmqModule.register('logging-queue'),
    RedisModule,
    HttpModule.register({
      timeout: 15000,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
