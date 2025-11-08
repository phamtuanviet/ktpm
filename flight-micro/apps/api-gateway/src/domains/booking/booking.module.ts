import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ProxyModule } from 'src/proxy/proxy.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ProxyModule, HttpModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
