import { Injectable } from '@nestjs/common';
import { AircraftRepository } from './aircarf.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchAircraftDto } from './dto/searchAircarft.dto';
import { FilterAircraftDto } from './dto/filterAircraft.dto';
import { CreateAircraftDto } from './dto/createAircraft.dto';
import { UpdateAircraftDto } from './dto/updateAircraft.dto';

@Injectable()
export class AircraftService {
  constructor(
    private readonly aircraftRepository: AircraftRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async getAircraftByName(query: string, tx?: any) {
    return await this.aircraftRepository.searchAircraftsByName(query, tx);
  }

  async getAircraftById(id: string, tx?: any) {
    const aircarf = await this.aircraftRepository.getAircraftById(id, tx);
    return { aircarf };
  }

  async getAircraftsInFlight(q: string) {
    const aircarfs = await this.aircraftRepository.searchAircraftsByName(q);
    return { aircarfs };
  }

  async getAircraftsForAdmin(query: SearchAircraftDto) {
    const { aircrafts, totalPages, currentPage } =
      await this.aircraftRepository.getAircraftsBysearch(query);
  }

  async getAircraftsByFilterForAdmin(query: FilterAircraftDto) {
    const { aircrafts, totalPages, currentPage } =
      await this.aircraftRepository.filterTickets(query);
    return { aircrafts, totalPages, currentPage };
  }

  async createAircraft(dto: CreateAircraftDto) {
    return await this.aircraftRepository.createAircraft(dto);
  }

  async updateAircraft(dto: UpdateAircraftDto) {
    return await this.aircraftRepository.updateAircraft(dto);
  }

  async deleteAircraft(id: string) {
    return await this.aircraftRepository.deleteAircraft(id);
  }

  async countAircrafts() {
    return await this.aircraftRepository.countAircrafts();
  }
}
