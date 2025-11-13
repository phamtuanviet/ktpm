import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { FlightSeatService } from './flightSeat.service';
import { FlightSeatRepository } from './flightSeat.repository';
import { CreateFlightSeatsForFlightDto } from './dto/createFlighSeatForFlight.dto';

const FLIGHT_BOOKING_EXCHANGE = 'flight-booking-exchange';

@Injectable()
export class FlightSeatSagaHandle {
  constructor(
    private readonly flightSeatService: FlightSeatService,
    private readonly flightSeatRepository: FlightSeatRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: FLIGHT_BOOKING_EXCHANGE,
    routingKey: 'seats.create',
    queue: 'flight-seat-service-create-queue',
  })
  async handleCreateSeat(data: CreateFlightSeatsForFlightDto) {
    try {
      const { seats } =
        await this.flightSeatService.createFlightSeatsForFlight(data);
      await this.amqpConnection.publish(
        FLIGHT_BOOKING_EXCHANGE,
        'flight.create.success',
        data.flightId,
      );
    } catch (error) {
      await this.amqpConnection.publish(
        FLIGHT_BOOKING_EXCHANGE,
        'flight.create.failed',
        data.flightId,
      );
    }
  }

  @RabbitSubscribe({
    exchange: FLIGHT_BOOKING_EXCHANGE,
    routingKey: 'seats.update',
    queue: 'flight-seat-service-update-queue',
  })
  async handleUpdateSeat(data: CreateFlightSeatsForFlightDto) {
    try {
      const { seats } =
        await this.flightSeatService.updateFlightSeatsForFlight(data);
      await this.amqpConnection.publish(
        FLIGHT_BOOKING_EXCHANGE,
        'flight.update.success',
        data.flightId,
      );
    } catch (error) {
      await this.amqpConnection.publish(
        FLIGHT_BOOKING_EXCHANGE,
        'flight.update.failed',
        data.flightId,
      );
    }
  }
}
