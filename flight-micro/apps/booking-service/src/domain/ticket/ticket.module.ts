import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketRepository } from './ticket.repository';
import { TicketService } from './ticket.service';

@Module({
  imports: [],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository],
})
export class TicketModule {}
