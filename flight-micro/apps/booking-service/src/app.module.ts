import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { TicketModule } from './domain/ticket/ticket.module';
import { PassengerModule } from './domain/passenger/passenger.module';
import { FlightSeatModule } from './domain/flightSeat/flightSeat.module';
import { BookingModule } from './domain/booking/booking.module';

import { SharedRabbitModule } from './rbmq/shared-rabbit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedRabbitModule,
    // RmqBindingModule,
    PrismaModule,
    // RmqModule.register('logging-queue'),
    // RmqModule.register('email-queue'),
    // RmqModule.register('flight-booking-exchange'),
    RedisModule,
    TicketModule,
    PassengerModule,
    FlightSeatModule,
    BookingModule,
  ],
  controllers: [],
})
export class AppModule {}
