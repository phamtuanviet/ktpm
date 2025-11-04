import { Injectable } from '@nestjs/common';
import { SeatClass } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FlightSeatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findFlightSeatById(id: string, tx?: any) {
    const data = tx ?? this.prismaService;
    return data.flightSeat.findUnique({
      where: {
        id: id,
      },
    });
  }
  findFlightSeatByFlightId(id: string, tx?: any) {
    const data = tx ?? this.prismaService;
    return data.flightSeat.findMany({
      where: {
        flightId: id,
      },
    });
  }

  findFlightSeatBySeatClassAndFlight(
    flightId: string,
    seatClass: SeatClass,
    tx?: any,
  ) {
    const data = tx ?? this.prismaService;
    return data.flightSeat.findMany({
      where: {
        flightId: flightId,
        seatClass: seatClass,
      },
    });
  }

  createFlightSeat(
    flightId: string,
    seatClass: SeatClass,
    totalSeats: number,
    price: number,
    tx?: any,
  ) {
    const data = tx ?? this.prismaService;
    return data.flightSeat.create({
      data: {
        flightId: flightId,
        seatClass: seatClass,
        totalSeats: totalSeats,
        price: price,
      },
    });
  }

  updateFlightSeat(
    flightId: string,
    seatClass: SeatClass,
    totalSeats: number,
    price: number,
    tx?: any,
  ) {
    const data = tx ?? this.prismaService;
    return data.flightSeat.update({
      where: {
        flightId: flightId,
        seatClass: seatClass,
      },
      data: {
        totalSeats: totalSeats,
        price: price,
      },
    });
  }
  updateBookedSeats(id: string, quantity?: number, tx?: any) {
    const q = quantity ?? 1;
    const data = tx ?? this.prismaService;
    return data.flightSeat.update({
      where: {
        id: id,
      },
      data: {
        bookedSeats: {
          increment: q,
        },
      },
    });
  }
}
