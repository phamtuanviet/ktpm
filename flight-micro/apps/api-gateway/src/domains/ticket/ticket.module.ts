import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { ProxyModule } from 'src/proxy/proxy.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ProxyModule, HttpModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
