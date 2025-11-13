import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { FilterTicketDto } from './dto/filterTicket.dto';
import { SearchTicketDto } from './dto/searchTicket.dto';
import { CancelTicketDto } from './dto/cancelTicket.dto';
import { LookupTicketDto } from './dto/lookupTicket.dto';

@Controller('api/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('tickets-filter-admin')
  async getTicketFilterForAdmin(@Query() dto: FilterTicketDto) {
    return this.ticketService.getTicketFilterForAdmin(dto);
  }

  @Get('tickets-admin')
  async getTicketForAdmin(@Query() dto: SearchTicketDto) {
    return this.ticketService.getTicketForAdmin(dto);
  }

  @Put('cancel')
  async cancelTicket(@Body() dto: CancelTicketDto) {
    return this.ticketService.cancelTicket(dto.id, dto.cancelCode);
  }

  @Get('tickets-lookup-client')
  async getTicketLookupForClient(
    @Query() dto: LookupTicketDto,
    @Req() req: Request,
  ) {
    let user = null;

    const userHeader = req?.headers['x-user'];
    if (userHeader) {
      try {
        user = JSON.parse(userHeader as string);
        return this.ticketService.searchTicketForClient(
          dto.query,
          (user as any).email,
        );
      } catch (error) {
        console.error('Invalid x-user header:', error);
      }
    }
    return this.ticketService.searchTicketForClient(dto.query, undefined);
  }

  @Get('count-tickets-stats')
  async countTicketsStats() {
    return this.ticketService.countTicketStats();
  }

  @Get('revenue-stats')
  async getRevenueStats() {
    return this.ticketService.getRevenueStats();
  }

  @Get(':id')
  async getTicketById(@Param('id') id: string) {
    return this.ticketService.getTicketById(id);
  }
}
