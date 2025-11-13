import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchAircraftDto } from './dto/searchAircarft.dto';
import { FilterAircraftDto } from './dto/filterAircraft.dto';
import { UpdateAircraftDto } from './dto/updateAircraft.dto';
import { CreateAircraftDto } from './dto/createAircraft.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AircraftRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getAircraftById(id: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.aircraft.findUnique({
      where: {
        id: id,
      },
    });
  }

  searchAircraftsByName(q: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.aircraft.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { manufacturer: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: {
        name: 'asc',
      },
    });
  }

  searchAircraftByName(q: string, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.aircraft.findFirst({
      where: {
        OR: [{ name: { contains: q } }],
      },
    });
  }

  async getAircraftsBysearch(dto: SearchAircraftDto) {
    const { page, pageSize, sortBy, sortOrder, query } = dto;
    const pageNum = page && page > 0 ? page : 1;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : 10;
    const skip = (pageNum - 1) * pageSizeNum;

    const searchCondition: any = {};
    if (query) {
      searchCondition.OR = [
        { id: { startsWith: query, mode: 'insensitive' } },
        { name: { startsWith: query, mode: 'insensitive' } },
        { manufacturer: { startsWith: query, mode: 'insensitive' } },
      ];
    }
    const orderByOption: Prisma.AircraftOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc' }
      : { id: 'asc' };

    const [aircrafts, totalAircrafts] = await this.prismaService.$transaction([
      this.prismaService.aircraft.findMany({
        where: searchCondition,
        skip,
        take: pageSize,
        orderBy: orderByOption,
      }),
      this.prismaService.aircraft.count({ where: searchCondition }),
    ]);

    return {
      aircrafts,
      totalPages: Math.ceil(totalAircrafts / pageSizeNum),
      currentPage: pageNum,
    };
  }

  async filterTickets(query: FilterAircraftDto) {
    const { page, pageSize, sortBy, sortOrder, ...filters } = query;
    const pageNum = page && page > 0 ? page : 1;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : 10;
    const sortByField = sortBy ? sortBy : 'bookedAt';
    const sortOrderValue = sortOrder ? sortOrder : 'desc';
    const skip = (pageNum - 1) * pageSizeNum;

    const operatorMap = {
      id: (val: string) => ({ startsWith: val }),
      name: (val: string) => ({ startsWith: val }),
      manufacturer: (val: string) => ({ startsWith: val }),
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

    const [aircrafts, totalAircrafts] = await this.prismaService.$transaction([
      this.prismaService.aircraft.findMany({
        where,
        skip,
        take: pageSizeNum,
        orderBy: { [sortByField]: sortOrderValue },
      }),
      this.prismaService.aircraft.count({ where }),
    ]);

    return {
      aircrafts,
      totalPages: Math.ceil(totalAircrafts / pageSizeNum),
      currentPage: pageNum,
    };
  }

  countAircrafts() {
    return this.prismaService.aircraft.count();
  }

  deleteAircraft(id: string) {
    return this.prismaService.aircraft.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  updateAircraft(id: string, dto: UpdateAircraftDto, tx?: any) {
    const { ...updateData } = dto;
    const db = tx ?? this.prismaService;
    return db.aircraft.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    });
  }

  createAircraft(dto: CreateAircraftDto, tx?: any) {
    const db = tx ?? this.prismaService;
    return db.aircraft.create({
      data: {
        ...dto,
      },
    });
  }
}
