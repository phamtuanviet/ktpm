import { Inject, Injectable } from '@nestjs/common';
import { PassengerRepository } from './passenger.repositoty';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePassengerDto } from './dto/createPassenger.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PassengerService {
  // Service methods would go here
  constructor(
    private readonly passengerRepository: PassengerRepository,
    private readonly prismaService: PrismaService,
    private readonly amqpConnection: AmqpConnection,
    private readonly redisService: RedisService,
  ) {
    // Dependency injection would go here
  }

  async findPassengerById(id: string) {
    const cached = await this.redisService.get(`passenger:${id}`);
    if (cached) return { passenger: cached };
    const passenger = await this.passengerRepository.findPassengerById(id);
    
    await this.redisService.set(
      `passenger:${id}`,
      JSON.stringify(passenger),
      600,
    );
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
