import { Injectable } from '@nestjs/common';
import { PassengerType } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PassengerRepository {
  constructor(private readonly prismaService: PrismaService) {}
  // Repository methods would go here
  findPassengerById(id: string) {
    return this.prismaService.passenger.findUnique({
      where: {
        id: id,
      },
    });
  }
  createPassenger(
    fullName: string,
    email: string,
    dob: Date,
    passengerType: PassengerType,
    passport?: string,
    tx?: any,
  ) {
    const db = tx ?? this.prismaService;
    return db.passenger.create({
      data: {
        fullName: fullName,
        email: email,
        dob: dob,
        passport: passport,
        passengerType : passengerType,
      },
    });
  }

  findPassengersByEmail(email: string) {
    return this.prismaService.passenger.findMany({
      where: {
        email: email,
      },
    });
  }
}
