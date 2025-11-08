import { Controller, Inject } from '@nestjs/common';
import { FlightSeatService } from './flightSeat.service';
import { FlightSeatRepository } from './flightSeat.repository';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { CreateFlightSeatsForFlightDto } from './dto/createFlighSeatForFlight.dto';

@Controller()
export class FlightSeatSagaHandle {
  constructor(
    private readonly flightSeatService: FlightSeatService,
    private readonly flightSeatRepository: FlightSeatRepository,
    @Inject('flight-booking-queue')
    private readonly flightBookingQueue: ClientProxy,
  ) {}

  @EventPattern('seats.create')
  async handleCreateSeat(data: CreateFlightSeatsForFlightDto) {
    try {
      const { seats } =
        await this.flightSeatService.createFlightSeatsForFlight(data);
      this.flightBookingQueue.emit('flight.create.success', data.flightId);
    } catch (error) {
      console.error('Error creating flight seats:', error);
      this.flightBookingQueue.emit('flight.create.failed', data.flightId);
    }
  }

  @EventPattern('seats.update')
  async handleUpdateSeat(data: CreateFlightSeatsForFlightDto) {
    try {
      console.log('Updating flight seats:', data);
      const { seats } =
        await this.flightSeatService.updateFlightSeatsForFlight(data);
      this.flightBookingQueue.emit('flight.update.success', data.flightId);
    } catch (error) {
      console.error('Error updating flight seats:', error);
      this.flightBookingQueue.emit('flight.update.failed', data.flightId);
    }
  }
}
