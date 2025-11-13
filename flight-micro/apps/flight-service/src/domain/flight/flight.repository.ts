import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchFlightDto } from './dto/searchFlight.dto';
import { FilterFlightDto } from './dto/filterFlight.dto';
import { SagaStatus } from '@prisma/client';
import { FlightStatus } from 'generated/prisma';

@Injectable()
export class FlightRepository {
  constructor(private readonly prismaService: PrismaService) {}

  searchFlightByName(query: string) {
    return this.prismaService.flight.findMany({
      where: {
        sagaStatus: SagaStatus.CONFIRMED,
        flightNumber: {
          startsWith: query,
        },
      },
      take: 10,
      orderBy: {
        flightNumber: 'asc',
      },
    });
  }

  async getFlightsBySearch(dto: SearchFlightDto) {
    const { page, pageSize, sortBy, sortOrder, query } = dto;
    const pageNum = page && page > 0 ? page : 1;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : 10;
    const skip = (pageNum - 1) * pageSizeNum;
    const sortByField = sortBy ? sortBy : 'departureTime';
    const sortOrderField = sortOrder ? sortOrder : 'asc';

    const searchCondition: any = { sagaStatus: SagaStatus.CONFIRMED };
    if (query) {
      searchCondition.OR = [
        { id: { startsWith: query } },
        { flightNumber: { startsWith: query } },
        {
          departureAirport: {
            is: {
              OR: [
                { name: { startsWith: query } },
                { iataCode: { startsWith: query } },
                { icaoCode: { startsWith: query } },
              ],
            },
          },
        },
        {
          arrivalAirport: {
            is: {
              OR: [
                { name: { startsWith: query } },
                { iataCode: { startsWith: query } },
                { icaoCode: { startsWith: query } },
              ],
            },
          },
        },
        { aircraft: { name: { startsWith: query } } },
      ];
    }

    let orderByOption;

    if (
      sortByField === 'departureAirport' ||
      sortByField === 'arrivalAirport' ||
      sortByField === 'aircraft'
    ) {
      orderByOption = {
        [sortByField]: {
          name: sortOrderField.toLowerCase() === 'desc' ? 'desc' : 'asc',
        },
      };
    } else {
      orderByOption = {
        [sortByField]: sortOrderField.toLowerCase() === 'desc' ? 'desc' : 'asc',
      };
    }

    const [flights, totalFlights] = await this.prismaService.$transaction([
      this.prismaService.flight.findMany({
        where: searchCondition,
        skip,
        take: pageSize,
        orderBy: orderByOption,
        include: {
          aircraft: {
            select: { name: true },
          },
          departureAirport: {
            select: { name: true, iataCode: true, icaoCode: true },
          },
          arrivalAirport: {
            select: { name: true, iataCode: true, icaoCode: true },
          },
        },
      }),
      this.prismaService.flight.count({ where: searchCondition }),
    ]);
    return {
      flights,
      totalPages: Math.ceil(totalFlights / pageSizeNum),
      currentPage: pageNum,
    };
  }

  getFlightById(id: string) {
    return this.prismaService.flight.findFirst({
      where: {
        id,
        sagaStatus: SagaStatus.CONFIRMED,
      },
      include: {
        departureAirport: true,
        arrivalAirport: true,
        aircraft: true,
      },
    });
  }

  async filterFlightsBySearch(dto: FilterFlightDto) {
    const { page, pageSize, sortBy, sortOrder, ...filters } = dto;
    const pageNum = page && page > 0 ? page : 1;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : 10;
    const sortByField = sortBy ? sortBy : 'flightNumber';
    const sortOrderValue = sortOrder ? sortOrder : 'desc';
    const skip = (pageNum - 1) * pageSizeNum;

    const operatorMap = {
      flightNumber: (val: string) => ({ flightNumber: { startsWith: val } }),
      status: (val: FlightStatus) => ({ status: { equals: val } }),
      id: (val: string) => ({ id: { startsWith: val } }),
      departureAirport: (val: string) => ({
        departureAirport: {
          name: {
            startsWith: val,
          },
        },
      }),
      arrivalAirport: (val: string) => ({
        arrivalAirport: {
          name: {
            startsWith: val,
          },
        },
      }),
      departureTime: (val: Date) => {
        if (isNaN(val.getTime())) return {};
        const start = new Date(val);
        const end = new Date(val);
        end.setDate(end.getDate() + 1);
        return { departureTime: { gte: start, lt: end } };
      },
      arrivalTime: (val: Date) => {
        if (isNaN(val.getTime())) return {};
        const start = new Date(val);
        const end = new Date(val);
        end.setDate(end.getDate() + 1);
        return { arrivalTime: { gte: start, lt: end } };
      },
    };

    const where = Object.entries(filters)
      .filter(([key, val]) => val && operatorMap[key])
      .reduce(
        (acc, [key, val]) => {
          return { ...acc, ...operatorMap[key](val) };
        },
        {} as Record<string, any>,
      );
    if (!Object.keys(where).length)
      throw new Error('At least one filter param is required');

    const lastWhere = {
      ...where,
      sagaStatus: SagaStatus.CONFIRMED,
    };
    const [flights, totalFlights] = await this.prismaService.$transaction([
      this.prismaService.flight.findMany({
        where: lastWhere,
        skip,
        take: pageSize,
        orderBy: { [sortByField]: sortOrderValue },
        include: {
          aircraft: {
            select: { name: true },
          },
          departureAirport: {
            select: { name: true, iataCode: true, icaoCode: true },
          },
          arrivalAirport: {
            select: { name: true, iataCode: true, icaoCode: true },
          },
        },
      }),
      this.prismaService.flight.count({ where }),
    ]);
    return {
      flights,
      totalPages: Math.ceil(totalFlights / pageSizeNum),
      currentPage: pageNum,
    };
  }

  findFlights(where: any, tx?: any) {
    const db = tx ?? this.prismaService;
    const lastWhere = {
      ...where,
      sagaStatus: SagaStatus.CONFIRMED,
    };
    return db.flight.findMany({
      where: lastWhere,
      include: {
        departureAirport: {
          select: { id: true, name: true, iataCode: true, icaoCode: true },
        },
        arrivalAirport: {
          select: { id: true, name: true, iataCode: true, icaoCode: true },
        },
        aircraft: { select: { id: true, name: true, manufacturer: true } },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });
  }

  findFlightByFlightNumber(flightNumber: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.flight.findUnique({
      where: {
        flightNumber,
        sagaStatus: SagaStatus.CONFIRMED,
      },
    });
  }

  createFlight(data: any, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.flight.create({
      data,
      include: {
        departureAirport: true,
        arrivalAirport: true,
        aircraft: true,
      },
    });
  }
  countFlights(tx?: any) {
    const db = tx ?? this.prismaService;
    return db.flight.count({
      where: { sagaStatus: SagaStatus.CONFIRMED },
    });
  }

  findFlightByIdAndStatus(id: string, statuses: string[], tx?: any) {
    const db = tx ?? this.prismaService;
    return db.flight.findFirst({
      where: {
        id,
        status: { in: statuses },
        sagaStatus: SagaStatus.CONFIRMED,
      },
      include: {
        departureAirport: true,
        arrivalAirport: true,
        aircraft: true,
      },
    });
  }

  updateFlight(data: any, tx?: any) {
    const db = tx ?? this.prismaService;
    const { id, ...rest } = data;
    return db.flight.update({
      where: { id, sagaStatus: SagaStatus.CONFIRMED },
      data: { ...rest },
      include: {
        departureAirport: true,
        arrivalAirport: true,
        aircraft: true,
      },
    });
  }

  async countStatus(tx?: any) {
    const db = tx ?? this.prismaService;
    const statusCounts = await db.flight.groupBy({
      where: { sagaStatus: SagaStatus.CONFIRMED },
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const ALL_STATUSES = [
      'SCHEDULED',
      'DELAYED',
      'DEPARTED',
      'ARRIVED',
      'CANCELLED',
    ];

    const resultMap = Object.fromEntries(
      statusCounts.map((item) => [item.status, item._count.id]),
    );

    return ALL_STATUSES.map((status) => ({
      status,
      count: resultMap[status] || 0,
    }));
  }

  getFlightsByIds(ids: string[], tx?: any) {
    const db = tx ?? this.prismaService;
    return db.flight.findMany({
      where: {
        id: { in: ids },
        sagaStatus: SagaStatus.CONFIRMED,
      },
      include: {
        aircraft: {
          select: { name: true },
        },
        departureAirport: {
          select: { name: true, iataCode: true, icaoCode: true },
        },
        arrivalAirport: {
          select: { name: true, iataCode: true, icaoCode: true },
        },
      },
    });
  }

  conFirmedSagaStatus(id: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.flight.update({
      where: { id, sagaStatus: SagaStatus.PENDING },
      data: { sagaStatus: SagaStatus.CONFIRMED },
    });
  }

  createFlightSagaFailed(id: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.flight.update({
      where: { id, sagaStatus: SagaStatus.PENDING },
      data: { sagaStatus: SagaStatus.FAILED },
    });
  }

  updateFlightSagaFailed(data: any, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.flight.update({
      where: { id: data.id, sagaStatus: SagaStatus.CONFIRMED },
      data,
    });
  }
}
