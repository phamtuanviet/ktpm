import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RmqModule } from './rbmq/rmq.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './domain/ticket/ticket.module';
import { PassengerModule } from './domain/passenger/passenger.module';
import { FlightSeatModule } from './domain/flightSeat/flightSeat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RmqModule.register('logging-queue'),
    RmqModule.register('email-queue'),
    RmqModule.register('flight-booking-queue'),
    RedisModule,
    TicketModule,
    PassengerModule,
    FlightSeatModule,
  ],
  controllers: [],
})
export class AppModule {}
