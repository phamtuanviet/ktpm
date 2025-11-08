import { Injectable } from '@nestjs/common';
import { startWith } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AirportRepository {
  constructor(private readonly prismaService: PrismaService) {}

  searchAirport(query: string, take?: number) {
    const number = take ? take : 10;

    const searchCondition: any = {};

    searchCondition.OR = [
      { name: { startsWith: query, mode: 'insensitive' } },
      { city: { startsWith: query, mode: 'insensitive' } },
      { iataCode: { startsWith: query, mode: 'insensitive' } },
      { icaoCode: { startsWith: query, mode: 'insensitive' } },
    ];
    return this.prismaService.airport.findMany({
      where: searchCondition,
      take: number,
      orderBy: {
        name: 'asc',
      },
    });
  }

  getAirportByName(name: string, tx?: any) {
    const db = tx ? tx : this.prismaService;
    return db.airport.findFirst({
      where: {
        name,
      },
    });
  }
}
