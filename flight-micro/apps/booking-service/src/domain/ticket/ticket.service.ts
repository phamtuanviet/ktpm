import { HttpException, Inject, Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { FlightSeat } from 'generated/prisma';
import { FilterTicketDto } from './dto/filterTicket.dto';
import { SearchTicketDto } from './dto/searchTicket.dto';
import { addDays, subDays, startOfDay } from 'date-fns';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly prismaService: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  // Service methods would go here

  safeMapTicket(ticket: any) {
    const { cancelCode, ...rest } = ticket;
    return rest;
  }

  async getTicketById(id: string) {
    const ticket = await this.ticketRepository.getTicketById(id);
    return { ticket };
  }

  // async createTicket() {
  //   const createdTicket = this.ticketRepository.createTicket(ticket);
  //   return { createdTicket };
  // }

  async generateUniqueCode(fieldName: string, tx?: any): Promise<string> {
    let code: string;
    let exists = true;
    let attempt = 0;
    const length = 8;
    const maxRetries = 5;
    const { nanoid } = await import('nanoid');

    do {
      if (attempt++ >= maxRetries) {
        throw new HttpException(
          `Failed to generate unique ${fieldName} after ${maxRetries} attempts`,
          500,
        );
      }

      code = nanoid(length).toUpperCase();
      const found = await this.ticketRepository.checkExsitingTicket(
        fieldName,
        code,
        tx,
      );
      exists = !!found;
    } while (exists);

    return code;
  }

  async createTicket(
    passengerId: string,
    flightSeatId: string,
    seatNumber?: string,
    tx?: any,
  ) {
    const cancelCode = await this.generateUniqueCode('cancelCode', tx);
    const bookingReference = await this.generateUniqueCode(
      'bookingReference',
      tx,
    );

    const ticket = await this.ticketRepository.createTicket(
      passengerId,
      flightSeatId,
      cancelCode,
      bookingReference,
      seatNumber,
      tx,
    );

    // this.loggingQueue.emit('ticket_created', {
    //   ticketId: ticket.id,
    //   passengerId,
    //   flightSeatId,
    //   seatNumber,
    //   cancelCode,
    //   bookingReference,
    // });

    return ticket;
  }

  async cancelTicket(ticketId: string, cancelCode: string, tx?: any) {
    const ticket = await this.ticketRepository.cancelTicket(
      ticketId,
      cancelCode,
      tx,
    );
    const safeTicket = this.safeMapTicket(ticket);
    return { ticket: safeTicket };
  }

  async getTicketFilterForAdmin(query: FilterTicketDto) {
    const { tickets, currentPage, totalPages } =
      await this.ticketRepository.filterTickets(query);
    return { tickets, currentPage, totalPages };
  }

  async getTicketForAdmin(query: SearchTicketDto) {
    const { tickets, currentPage, totalPages } =
      await this.ticketRepository.searchTickets(query);
    return { tickets, currentPage, totalPages };
  }

  async countTicketStats() {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6);
    const tickets = await this.ticketRepository.findTicketsLast7Days();
    const statsMap: Record<string, { booked: number; cancelled: number }> = {};
    for (let i = 0; i < 7; i++) {
      const current = addDays(sevenDaysAgo, i);
      current.setHours(current.getHours() + 7);
      const date = current.toISOString().slice(0, 10);
      statsMap[date] = { booked: 0, cancelled: 0 };
    }

    tickets.forEach((ticket) => {
      const date = new Date(ticket.bookedAt);
      date.setHours(date.getHours() + 7);
      const key = date.toISOString().slice(0, 10);
      if (statsMap[key]) {
        if (ticket.isCancelled) statsMap[key].cancelled += 1;
        else statsMap[key].booked += 1;
      }
    });

    const result = Object.entries(statsMap).map(
      ([isoDate, { booked, cancelled }]) => {
        const d = new Date(isoDate);
        const formattedDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        return { date: formattedDate, booked, cancelled };
      },
    );

    return { result };
  }

  async getRevenueStats() {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6);
    const tickets = await this.ticketRepository.findTicketsLast7Days();
    const revenueMap: Record<string, number> = {};

    for (let i = 0; i < 7; i++) {
      const current = addDays(sevenDaysAgo, i);
      current.setHours(current.getHours() + 7);
      const date = current.toISOString().slice(0, 10);
      revenueMap[date] = 0;
    }

    tickets.forEach((ticket) => {
      const date = new Date(ticket.bookedAt);
      date.setHours(date.getHours() + 7);
      const dateKey = date.toISOString().slice(0, 10);
      const price = ticket.flightSeat.price;
      const scale =
        ticket?.passenger?.passengerType === 'ADULT'
          ? 1
          : ticket?.passenger?.passengerType === 'CHILD'
            ? 0.8
            : 1;
      const revenue = price * scale;

      if (revenueMap[dateKey] !== undefined) {
        revenueMap[dateKey] += revenue;
      }
    });

    const result = Object.entries(revenueMap)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([isoDate, total]) => {
        const dateObj = new Date(isoDate);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return { date: formattedDate, total };
      });

    return { result };
  }

  async searchTicketForClient(query?: string, email?: string) {
    const tickets =
      await this.ticketRepository.getTicketByEmailOrBookingReference(
        query,
        email,
      );

    const lastTickets = tickets.map((ticket) => this.safeMapTicket(ticket));

    return { tickets: lastTickets };
  }
}
