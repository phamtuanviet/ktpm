import { Injectable } from '@nestjs/common';
import { SeatClass } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

import { FilterTicketDto } from './dto/filterTicket.dto';
import { SearchTicketDto } from './dto/searchTicket.dto';
import { startOfDay, subDays, addDays } from 'date-fns';

@Injectable()
export class TicketRepository {
  // Repository methods would go here
  constructor(private readonly prismaService: PrismaService) {
    // Dependency injection would go here
  }

  getTicketById(id: string, tx?: any) {
    const db = tx ? tx : this.prismaService;
    return db.ticket.findUnique({
      where: {
        id,
      },
      include: {
        flightSeat: true,
        passenger: true,
      },
    });
  }

  checkExsitingTicket(type: string, code: string, tx?: any) {
    const db = tx ? tx : this.prismaService;
    const data = db.ticket.findUnique({
      where: {
        [type]: code,
      },
    });
    return data;
  }

  createTicket(
    passengerId: string,
    flighSeatId: string,
    cancelCode: string,
    bookingReference: string,
    seatNumber?: string,
    tx?: any,
  ) {
    const db = tx ?? this.prismaService;
    return db.ticket.create({
      passengerId,
      flighSeatId,
      cancelCode,
      bookingReference,
      seatNumber,
    });
  }

  cancelTicket(id: string, cancelCode: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.ticket.update({
      where: {
        cancelCode,
        isCanceled: false,
      },
      data: {
        isCanceled: true,
        cancelAt: new Date(),
      },
    });
  }

  async filterTickets(query: FilterTicketDto) {
    const { page, pageSize, sortBy, sortOrder, ...filters } = query;
    const pageNum = page && page > 0 ? page : 1;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : 10;
    const sortByField = sortBy ? sortBy : 'bookedAt';
    const sortOrderValue = sortOrder ? sortOrder : 'desc';
    const skip = (pageNum - 1) * pageSizeNum;

    const operatorMap = {
      flightId: (val: string) => ({
        flightSeat: { flightId: { equals: val } },
      }),
      id: (val: string) => ({ equal: val }),
      email: (val: string) => ({
        passenger: { email: { equals: val } },
      }),
      isCanceled: (val: string) => ({ equals: val === 'true' }),
    };

    const where = Object.entries(filters)
      .filter(([key, val]) => val && operatorMap[key])
      .reduce(
        (acc, [key, val]) => {
          acc[key] = operatorMap[key](val);
          return acc;
        },
        {} as Record<string, any>,
      );

    if (!Object.keys(where).length)
      throw new Error('At least one filter param is required');

    const [tickets, totalTickets] = await this.prismaService.$transaction([
      this.prismaService.ticket.findMany({
        where,
        include: {
          flightSeat: true,
          passenger: true,
        },
        skip,
        take: pageSizeNum,
        orderBy: { [sortByField]: sortOrderValue },
      }),
      this.prismaService.ticket.count({ where }),
    ]);

    return {
      tickets,
      totalPages: Math.ceil(totalTickets / pageSizeNum),
      currentPage: pageNum,
    };
  }

  async searchTickets(dto: SearchTicketDto) {
    const { page, pageSize, sortBy, sortOrder, query } = dto;
    const pageNum = page && page > 0 ? page : 1;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : 10;
    const skip = (pageNum - 1) * pageSizeNum;

    const searchCondition: any = {};
    if (query) {
      searchCondition.OR = [
        {
          passsenger: {
            is: {
              OR: [
                { email: { startsWith: query } },
                { name: { startsWith: query } },
              ],
            },
          },
          flightSeat: {
            is: {
              OR: [
                { flightId: { startsWith: query } },
                { id: { startWith: query } },
              ],
            },
          },
          seatNumber: { startsWith: query },
          bookingReference: { startsWith: query },
          id: { startsWith: query },
        },
      ];
    }

    let orderByOption;

    if (sortBy === 'flightSeat') {
      orderByOption = {
        [sortBy]: {
          seatClass: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc',
        },
      };
    } else if (sortBy === 'passengerName') {
      orderByOption = {
        ['passenger']: {
          fullName: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc',
        },
      };
    } else if (sortBy === 'passengerEmail') {
      orderByOption = {
        ['passenger']: {
          email: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc',
        },
      };
    } else {
      orderByOption = {
        [sortBy]: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc',
      };
    }

    const [tickets, totalTickets] = await this.prismaService.$transaction([
      this.prismaService.tickets.findMany({
        where: searchCondition,
        include: {
          flightSeat: true,
          passenger: true,
        },
        skip,
        take: pageSize,
        orderBy: orderByOption,
      }),
      this.prismaService.tickets.count({ where: searchCondition }),
    ]);

    return {
      tickets,
      totalPages: Math.ceil(totalTickets / pageSizeNum),
      currentPage: pageNum,
    };
  }

  findTicketsLast7Days(tx?: any) {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6);
    const tomorrow = addDays(today, 1);
    const db = tx ?? this.prismaService;

    return db.ticket.findMany({
      where: {
        bookedAt: {
          gte: sevenDaysAgo,
          lt: tomorrow,
        },
        isCancel: false,
      },
      include: {
        flightSeat: true,
        passenger: true,
      },
    });
  }

  getTicketByEmailOrBookingReference(query: string) {
    return this.prismaService.ticket.findMany({
      where: {
        OR: [
          {
            passenger: {
              email: {
                startAt: query,
              },
            },
          },
          {
            bookingReference: {
              startAt: query,
            },
          },
        ],
      },
      include: {
        flightSeat: true,
        passenger: true,
      },
    });
  }
}
