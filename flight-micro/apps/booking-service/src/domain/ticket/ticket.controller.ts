import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { FilterTicketDto } from './dto/filterTicket.dto';
import { SearchTicketDto } from './dto/searchTicket.dto';
import { CancelTicketDto } from './dto/cancelTicket.dto';
import { LookupTicketDto } from './dto/lookupTicket.dto';

@Controller('api/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('tickets-filter-admin')
  async getTicketFilterForAdmin(@Param() dto: FilterTicketDto) {
    return this.ticketService.getTicketFilterForAdmin(dto);
  }

  @Get('tickets-admin')
  async getTicketForAdmin(@Param() dto: SearchTicketDto) {
    return this.ticketService.getTicketForAdmin(dto);
  }

  @Get(':id')
  async getTicketById(@Param('id') id: string) {
    return this.ticketService.getTicketById(id);
  }

  @Put('cancel')
  async cancelTicket(@Body() dto: CancelTicketDto) {
    return this.ticketService.cancelTicket(dto.id, dto.cancelCode);
  }

  @Get('tickets-lookup-client')
  async getTicketLookupForClient(@Param() dto: LookupTicketDto) {
    return this.ticketService.searchTicketForClient(dto.query);
  }

  @Get('count-tickets-stats')
  async countTicketsStats() {
    return this.ticketService.countTicketStats();
  }

  @Get('revenue-stats')
  async getRevenueStats() {
    return this.ticketService.getRevenueStats();
  }
}
