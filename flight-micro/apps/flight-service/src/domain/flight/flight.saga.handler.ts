import { Injectable, Logger } from '@nestjs/common';
import { FlightRepository } from './flight.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class FlightSagaHandler {
  constructor(
    private readonly flightRepository: FlightRepository,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  private readonly logger = new Logger(FlightSagaHandler.name);

  @EventPattern('flight.create.failed')
  async handleCreateFlightFailed(id: string) {
    try {
      await this.flightRepository.createFlightSagaFailed(id);
    } catch (error) {
      this.logger.error(
        `Failed to update flight status to CONFIRMED: ${error.message}`,
      );
    }
  }

  @EventPattern('flight.create.success')
  async handleCreateFlightSuccess(id: string) {
    try {
      await this.flightRepository.conFirmedSagaStatus(id);
    } catch (error) {
      this.logger.error(
        `Failed to update flight status to CONFIRMED: ${error.message}`,
      );
    }
  }

  @EventPattern('flight.update.failed')
  async handleUpdateFlightFailed(id: string) {
    try {
      const oldData = await this.redisService.get(`flight-temp-${id}`);
      await this.flightRepository.updateFlightSagaFailed(oldData);
      await this.redisService.del(`flight-temp-${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to update flight status to CONFIRMED: ${error.message}`,
      );
    }
  }

  @EventPattern('flight.update.success')
  async handleUpdateFlightSuccess(id: string) {
    try {
      await this.flightRepository.conFirmedSagaStatus(id);
    } catch (error) {
      this.logger.error(
        `Failed to update flight status to CONFIRMED: ${error.message}`,
      );
    }
  }
}
