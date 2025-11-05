import { Controller, Get, Put, Req, Res } from '@nestjs/common';
import { TicketService } from './ticket.service';
import type { Request, Response } from 'express';

@Controller('api/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('tickets-filter-admin')
  async getTicketFilterForAdmin(@Req() req: Request, @Res() res: Response) {
    const { tickets, totalPages, currentPage } =
      await this.ticketService.getTicketFilterForAdmin(req);
    return res.json({
      tickets,
      totalPages,
      currentPage,
      success: true,
    });
  }

  @Get('tickets-admin')
  async getTicketForAdmin(@Req() req: Request, @Res() res: Response) {
    const { tickets, totalPages, currentPage } =
      await this.ticketService.getTicketForAdmin(req);
    return res.json({
      tickets,
      totalPages,
      currentPage,
      success: true,
    });
  }

  @Get(':id')
  async getTicketById(@Req() req: Request, @Res() res: Response) {
    const { ticket } = await this.ticketService.getTicketById(req);
    return res.json({
      ticket,
      success: true,
    });
  }

  @Put('cancel')
  async cancelTicket(@Req() req: Request, @Res() res: Response) {
    const { ticket } = await this.ticketService.cancelTicket(req);
    return res.json({
      ticket: ticket,
      message: 'Cancel ticket successfully',
      success: true,
    });
  }

  @Get('tickets-lookup-client')
  async getTicketLookupForClient(@Req() req: Request, @Res() res: Response) {
    const { tickets } = await this.ticketService.searchTicketForClient(req);
    return res.json({
      tickets,
      success: true,
    });
  }

  @Get('count-tickets-stats')
  async countTicketsStats(@Req() req: Request, @Res() res: Response) {
    const { result } = await this.ticketService.countTicketStats(req);
    return res.json({
      result,
      success: true,
    });
  }

  @Get('revenue-stats')
  async getRevenueStats(@Req() req: Request, @Res() res: Response) {
    const { result } = await this.ticketService.getRevenueStats(req);
    return res.json({
      result,
      success: true,
    });
  }
}
