import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketRepository } from './ticket.repository';
import { TicketService } from './ticket.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { SharedRabbitModule } from 'src/rbmq/shared-rabbit.module';

@Module({
  imports: [SharedRabbitModule
  ],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository],
  exports: [TicketService],
})
export class TicketModule {}
