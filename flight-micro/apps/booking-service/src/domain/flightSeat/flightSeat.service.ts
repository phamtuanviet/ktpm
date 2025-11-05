import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';
import { FlightSeatRepository } from './flightSeat.repository';
import { SeatClass } from 'generated/prisma';
import { CreateFlightSeatsForFlightDto } from './dto/createFlighSeatForFlight.dto';
import { GetSeatsByFlightsDto } from './dto/getSeatsByFlights.dto';

@Injectable()
export class FlightSeatService {
  constructor(
    private readonly flightSeatRepository: FlightSeatRepository,
    private readonly prismaService: PrismaService,
    @Inject('logging-queue') private readonly loggingQueue: ClientProxy,
  ) {}

  async getFlightSeatById(id: string) {
    const flighSeat = await this.flightSeatRepository.findFlightSeatById(id);
    return { flighSeat };
  }

  async getFlightSeatsByFlightId(id: string) {
    const flightSeats =
      await this.flightSeatRepository.findFlightSeatByFlightId(id);
    return { flightSeats };
  }

  async getFlightSeatsByFlightIdAndSeatType(
    id: string,
    seatType: SeatClass,
    tx?: any,
  ) {
    const flightSeats =
      await this.flightSeatRepository.findFlightSeatBySeatClassAndFlight(
        id,
        seatType,
        tx,
      );
    return { flightSeats };
  }

  async updateBookedSeats(id: string, quantity: number, tx?: any) {
    const updatedFlightSeat = await this.flightSeatRepository.updateBookedSeats(
      id,
      quantity,
      tx,
    );
    return { updatedFlightSeat };
  }

  async createFlightSeatsForFlight(dto: CreateFlightSeatsForFlightDto) {
    const seats = await this.prismaService.$transaction(async (tx) => {
      const createdSeats = await Promise.all(
        dto.seats.map((seat) =>
          this.flightSeatRepository.createFlightSeat(
            dto.flightId,
            seat.seatClass,
            seat.totalSeats,
            seat.price,
            tx,
          ),
        ),
      );
      return createdSeats;
    });

    return { seats };
  }

  async updateFlightSeatsForFlight(dto: CreateFlightSeatsForFlightDto) {
    const seats = await this.prismaService.$transaction(async (tx) => {
      const createdSeats = await Promise.all(
        dto.seats.map((seat) =>
          this.flightSeatRepository.createFlightSeat(
            dto.flightId,
            seat.seatClass,
            seat.totalSeats,
            seat.price,
            tx,
          ),
        ),
      );
      return createdSeats;
    });

    return { seats };
  }

  async getFlightSeatsByFlights(dto: GetSeatsByFlightsDto) {
    const seats = await this.flightSeatRepository.getSeatsByFlightIds(dto.ids);
    return { seats };
  }
}
