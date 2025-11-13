import { HttpException, Injectable } from '@nestjs/common';
import { AircraftRepository } from './aircraft.repository';
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
    return await this.aircraftRepository.searchAircraftByName(query, tx);
  }

  async getAircraftById(id: string, tx?: any) {
    const aircraft = await this.aircraftRepository.getAircraftById(id, tx);
    return { aircraft };
  }

  async getAircraftsInFlight(q: string) {
    const aircrafts = await this.aircraftRepository.searchAircraftsByName(q);
    return { aircrafts };
  }

  async getAircraftsForAdmin(query: SearchAircraftDto) {
    const { aircrafts, totalPages, currentPage } =
      await this.aircraftRepository.getAircraftsBysearch(query);
    return { aircrafts, totalPages, currentPage };
  }

  async getAircraftsByFilterForAdmin(query: FilterAircraftDto) {
    const { aircrafts, totalPages, currentPage } =
      await this.aircraftRepository.filterTickets(query);
    return { aircrafts, totalPages, currentPage };
  }

  async createAircraft(dto: CreateAircraftDto) {
    const aircraft = await this.aircraftRepository.createAircraft(dto);
    return { aircraft };
  }

  async updateAircraft(id: string, dto: UpdateAircraftDto) {

    const aircraft = await this.aircraftRepository.searchAircraftByName(
      dto.name,
    );
    if (!aircraft || aircraft.id == id) {
      const result = await this.aircraftRepository.updateAircraft(id, dto);
      return { aircraft: result };
    } else {
      return new HttpException(
        'Aircraft name is exsting or something went wrong',
        400,
      );
    }
  }

  async deleteAircraft(id: string) {
    return await this.aircraftRepository.deleteAircraft(id);
  }

  async countAircrafts() {
    return await this.aircraftRepository.countAircrafts();
  }
}
