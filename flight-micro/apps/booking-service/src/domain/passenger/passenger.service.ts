import { Inject, Injectable } from '@nestjs/common';
import { PassengerRepository } from './passenger.repositoty';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePassengerDto } from './dto/createPassenger.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class PassengerService {
  // Service methods would go here
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly prismaService: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    // Dependency injection would go here
  }

  async findPassengerById(id: string) {
    const passenger = await this.passengerRepository.findPassengerById(id);
    return { passenger };
  }

  async findPassengersByEmail(email: string) {
    const passengers =
      await this.passengerRepository.findPassengersByEmail(email);
    return { passengers };
  }

  async createPassenger(
    createPassengerDto: CreatePassengerDto,
    email: string,
    tx?: any,
  ) {
    const { fullName, passport, dob, passengerType } = createPassengerDto;
    const passenger = await this.passengerRepository.createPassenger(
      fullName,
      email,
      dob,
      passengerType,
      passport,
      tx,
    );
    return passenger;
  }
}
