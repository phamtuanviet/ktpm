import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { AuthModule } from './domains/auth/auth.module';
import { NewsModule } from './domains/news/news.module';
import { UserModule } from './domains/user/user.module';
import { AircraftModule } from './domains/aircraft/aircraft.module';
import { ProxyModule } from './proxy/proxy.module';
import { BookingModule } from './domains/booking/booking.module';
import { FlightModule } from './domains/flight/flight.module';
import { AirportModule } from './domains/airport/airport.module';
import { TicketModule } from './domains/ticket/ticket.module';
import { LoggingModule } from './log/logging.module';
import { LoggingService } from './log/logging.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/allException.filter';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore as any,
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379'),
        ttl: 60,
      }),
    }),
    LoggingModule,
    ProxyModule,
    AuthModule,
    NewsModule,
    UserModule,
    AircraftModule,
    BookingModule,
    FlightModule,
    AircraftModule,
    AirportModule,
    TicketModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
