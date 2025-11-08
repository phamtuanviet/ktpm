import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AirportRepository } from './airport.repository';

@Injectable()
export class AirportService {
  constructor(
    private readonly airportRepository: AirportRepository,
    private readonly prismaService: PrismaService,
  ) {}

  getAirportByName(name: string, tx?: any) {
    return this.airportRepository.getAirportByName(name, tx);
  }

  async getAirportsForClient(q: string) {
    const airports = await this.airportRepository.searchAirport(q, 20);
    return airports;
  }

  async getAirportsInFlightForAdmin(q: string) {
    const airports = await this.airportRepository.searchAirport(q);
    return { airports };
  }
}
