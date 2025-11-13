import { Injectable } from '@nestjs/common';
import { PassengerType, SeatClass } from 'generated/prisma';
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
    flightSeatId: string,
    cancelCode: string,
    bookingReference: string,
    seatNumber?: string,
    tx?: any,
  ) {
    const db = tx ?? this.prismaService;
    return db.ticket.create({
      data: {
        passenger: { connect: { id: passengerId } },
        flightSeat: { connect: { id: flightSeatId } },
        cancelCode,
        bookingReference,
        seatNumber,
      },
      include: {
        flightSeat: true,
        passenger: true,
      },
    });
  }

  cancelTicket(id: string, cancelCode: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.ticket.update({
      where: {
        cancelCode,
        isCancelled: false,
      },
      data: {
        isCancelled: true,
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
      passengerType: (val: PassengerType) => ({
        passenger: { passengerType: { equals: val } },
      }),
      seatClass: (val: SeatClass) => ({
        flightSeat: { seatClass: { equals: val } },
      }),
      passengerName: (val: string) => ({
        passenger: { fullName: { contains: val } },
      }),
      id: (val: string) => ({ id: { equal: val } }),
      passengerEmail: (val: string) => ({
        passenger: { email: { equals: val } },
      }),
      isCancelled: (val: boolean) => ({
        isCancelled: { equals: val },
      }),
    };

    const where = Object.entries(filters)
      .filter(([key, val]) => val && operatorMap[key])
      .reduce(
        (acc, [key, val]) => {
          return { ...acc, ...operatorMap[key](val) };
        },
        {} as Record<string, any>,
      );

    if (!Object.keys(where).length) {
      return {
        tickets: [],
        totalPages: 0,
        currentPage: 1,
      };
    }

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
          passenger: {
            is: {
              OR: [
                { email: { startsWith: query } },
                { fullName: { startsWith: query } },
              ],
            },
          },
          flightSeat: {
            is: {
              OR: [
                { flightId: { startsWith: query } },
                { id: { startsWith: query } },
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
      this.prismaService.ticket.findMany({
        where: searchCondition,
        include: {
          flightSeat: true,
          passenger: true,
        },
        skip,
        take: pageSize,
        orderBy: orderByOption,
      }),
      this.prismaService.ticket.count({ where: searchCondition }),
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
        isCancelled: false,
      },
      include: {
        flightSeat: true,
        passenger: true,
      },
    });
  }

  getTicketByEmailOrBookingReference(query?: string, emailUser?: string) {
    if (query && query != 'none') {
      return this.prismaService.ticket.findMany({
        where: {
          isCancelled: false,
          OR: [
            {
              passenger: {
                email: {
                  contains: query,
                },
              },
            },
            {
              bookingReference: {
                contains: query,
              },
            },
          ],
        },
        include: {
          flightSeat: true,
          passenger: true,
        },
      });
    } else {
      return this.prismaService.ticket.findMany({
        where: {
          isCancelled: false,
          passenger: {
            email: {
              contains: emailUser,
            },
          },
        },
        include: {
          flightSeat: true,
          passenger: true,
        },
      });
    }
  }
}
