import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'; // 👈 Import mới
import { FlightRepository } from './flight.repository';
import { PrismaService } from 'src/prisma/prisma.service'; // Giữ lại nếu cần, nhưng không dùng trực tiếp trong code này
import { RedisService } from 'src/redis/redis.service'; // Giữ lại

const FLIGHT_BOOKING_EXCHANGE = 'flight-booking-exchange';

@Injectable()
export class FlightSagaHandler {
  constructor(
    private readonly flightRepository: FlightRepository,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  private readonly logger = new Logger(FlightSagaHandler.name);

  @RabbitSubscribe({
    exchange: FLIGHT_BOOKING_EXCHANGE,
    routingKey: 'flight.create.failed',
    queue: 'flight-service-create-failed-queue',
  })
  async handleCreateFlightFailed(id: string) {
    try {
      await this.flightRepository.createFlightSagaFailed(id);
    } catch (error) {
      this.logger.error(
        `Failed to update flight status to CONFIRMED: ${error.message}`,
      );
    }
  }

  @RabbitSubscribe({
    exchange: FLIGHT_BOOKING_EXCHANGE,
    routingKey: 'flight.create.success',
    queue: 'flight-service-create-success-queue',
  })
  async handleCreateFlightSuccess(id: string) {
    try {
      await this.flightRepository.conFirmedSagaStatus(id);
    } catch (error) {
      this.logger.error(
        `Failed to update flight status to CONFIRMED: ${error.message}`,
      );
    }
  }

  @RabbitSubscribe({
    exchange: FLIGHT_BOOKING_EXCHANGE,
    routingKey: 'flight.update.failed',
    queue: 'flight-service-update-failed-queue',
  })
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

  @RabbitSubscribe({
    exchange: FLIGHT_BOOKING_EXCHANGE,
    routingKey: 'flight.update.success',
    queue: 'flight-service-update-success-queue',
  })
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
