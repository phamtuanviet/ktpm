import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AirportRepository } from './airport.repository';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AirportService {
  constructor(
    private readonly airportRepository: AirportRepository,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  getAirportByName(name: string, tx?: any) {
    return this.airportRepository.getAirportByName(name, tx);
  }

  async getAirportsForClient(q: string) {
    const cached = await this.redisService.get(`airport:client:${q}`);
    if (cached) return { airports: cached };
    const airports = await this.airportRepository.searchAirport(q, 20);
    if (airports.length > 0) {
      await this.redisService.set(
        `airport:client:${q}`,
        JSON.stringify(airports),
        900,
      );
    }

    return { airports };
  }

  async getAirportsInFlightForAdmin(q: string) {
    const cached = await this.redisService.get(`airport:admin:${q}`);
    if (cached) return { airports: cached };
    const airports = await this.airportRepository.searchAirport(q);
    if (airports.length > 0) {
      await this.redisService.set(
        `airport:admin:${q}`,
        JSON.stringify(airports),
        900,
      );
    }
    return { airports };
  }
}
