import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { AircraftModule } from './domain/aircraft/aircraft.module';
import { PrismaModule } from './prisma/prisma.module';
import { AirportModule } from './domain/airport/airport.module';
import { RmqModule } from './rbmq/rmq.module';
import { RedisModule } from './redis/redis.module';
import { FlightModule } from './domain/flight/flight.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AircraftModule,
    AirportModule,
    FlightModule,
    PrismaModule,
    RmqModule.register('logging-queue'),
    RmqModule.register('flight-booking-queue'),
    RedisModule,
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
