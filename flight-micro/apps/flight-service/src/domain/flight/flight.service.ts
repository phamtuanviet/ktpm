import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FlightRepository } from './flight.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { SearchFlightForUserDto } from './dto/searchFlightForUser.dto';
import { AirportService } from '../airport/airport.service';
import { AircraftService } from '../aircraft/aircraft.service';
import { CreateFlightDto } from './dto/createFlight.dto';
import { UpdateFlightDto } from './dto/updateFlight.dto';
import { SearchFlightDto } from './dto/searchFlight.dto';
import { FilterFlightDto } from './dto/filterFlight.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SagaStatus } from '@prisma/client';
import { RedisService } from 'src/redis/redis.service';
import { create } from 'axios';
import { FlightForTicketsDto } from './dto/flightsForTickets.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class FlightService {
  constructor(
    private readonly flightRepository: FlightRepository,
    private readonly prismaService: PrismaService,
    private readonly amqpConnection: AmqpConnection,
    private readonly airportService: AirportService,
    private readonly aircraftService: AircraftService,
    private readonly redisService: RedisService,
  ) {}

  private buildWhere(from: string, to: string, dateValue: string) {
    const start = new Date(dateValue);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return {
      departureAirport: {
        is: { name: { contains: from, mode: 'insensitive' } },
      },
      arrivalAirport: { is: { name: { contains: to, mode: 'insensitive' } } },
      OR: [
        { status: 'SCHEDULED', departureTime: { gte: start, lt: end } },
        { status: 'DELAYED', estimatedDeparture: { gte: start, lt: end } },
      ],
    };
  }

  async getFlightsForClient(params: SearchFlightForUserDto) {
    const {
      tripType,
      departureAirport,
      arrivalAirport,
      startDate,
      returnDate,
      adults,
      children,
    } = params;

    if (!tripType || !departureAirport || !arrivalAirport || !startDate) {
      throw new HttpException(
        'tripType, departureAirport, arrivalAirport and startDate are required',
        400,
      );
    }

    if (tripType === 'twoway' && !returnDate) {
      throw new HttpException('Return date is required for twoway trip', 400);
    }

    const totalPassengers = adults + children;
    if (totalPassengers < 1) {
      throw new HttpException('Must have at least 1 adult or child', 400);
    }

    const outboundWhere = this.buildWhere(
      departureAirport,
      arrivalAirport,
      startDate,
    );
    const outboundFlights =
      await this.flightRepository.findFlights(outboundWhere);

    let inboundFlights = [];
    if (tripType === 'twoway' && returnDate) {
      const returnWhere = this.buildWhere(
        arrivalAirport,
        departureAirport,
        returnDate,
      );
      inboundFlights = await this.flightRepository.findFlights(returnWhere);
    }

    return { outbound: outboundFlights, inbound: inboundFlights, tripType };
  }

  async generateUniqueFlightNumber(tx?: any): Promise<string> {
    let code: string;
    let exists = true;
    let attempt = 0;
    const length = 5;
    const maxRetries = 5;

    do {
      if (attempt++ >= maxRetries) {
        throw new HttpException(
          `Failed to generate unique flight number after ${maxRetries} attempts`,
          500,
        );
      }
      const { nanoid } = await import('nanoid');

      code = nanoid(length).toUpperCase();
      const found = await this.flightRepository.findFlightByFlightNumber(
        code,
        tx,
      );
      exists = !!found;
    } while (exists);

    return code;
  }

  async createFlight(data: CreateFlightDto) {
    if (data.departureTime >= data.arrivalTime) {
      throw new HttpException(
        'Departure time must be before arrival time',
        500,
      );
    }
    if (data.departureAirport === data.arrivalAirport) {
      throw new HttpException(
        'Departure and arrival airports must be different',
        400,
      );
    }

    const flight = await this.prismaService.$transaction(async (tx) => {
      const departureAirport = await this.airportService.getAirportByName(
        data.departureAirport,
        tx,
      );

      const arrivalAirport = await this.airportService.getAirportByName(
        data.arrivalAirport,
        tx,
      );

      const aircraft = await this.aircraftService.getAircraftByName(
        data.aircraft,
        tx,
      );

      if (!departureAirport || !arrivalAirport) {
        throw new HttpException('Invalid airport', 400);
      }

      if (!aircraft) {
        throw new HttpException('Invalid aircraft', 400);
      }

      if (!data.flightNumber) {
        data.flightNumber = await this.generateUniqueFlightNumber(tx);
      }

      const existing = await this.flightRepository.findFlightByFlightNumber(
        data.flightNumber,
        tx,
      );
      if (existing) {
        throw new HttpException('Flight already exists', 500);
      }

      const createdFlight = await this.flightRepository.createFlight(
        {
          flightNumber: data.flightNumber,
          departureTime: data.departureTime,
          arrivalTime: data.arrivalTime,
          aircraft: { connect: { id: aircraft.id } },
          departureAirport: { connect: { id: departureAirport.id } },
          arrivalAirport: { connect: { id: arrivalAirport.id } },
        },
        tx,
      );

      const sagaPayLoad = {
        flightId: createdFlight.id,
        seats: data.seats,
      };

      await this.amqpConnection.publish(
        'flight-booking-exchange',
        'seats.create',
        sagaPayLoad,
      );

      return createdFlight;
    });
    return { flight };
  }

  async updateFlight(id: string, data: UpdateFlightDto) {
    const { departureTime, arrivalTime } = data;

    const flight = await this.flightRepository.findFlightByIdAndStatus(id, [
      'DELAYED',
      'SCHEDULED',
    ]);

    if (!flight) {
      throw new HttpException('Flight not found', 404);
    }

    const flightResult = await this.prismaService.$transaction(async (tx) => {
      if (!departureTime || !arrivalTime) {
        return flight;
      } else {
        const flightSaved = {
          id: flight.id,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          estimatedDeparture: flight.estimatedDeparture,
          estimatedArrival: flight.estimatedArrival,
          sagaStatus: flight.sagaStatus,
          status: flight.status,
        };
        if (departureTime >= arrivalTime) {
          throw new HttpException(
            'Departure time must be before arrival time',
            500,
          );
        }
        await this.redisService.set(`flight-temp-${flight.id}`, flightSaved);
        const dateValue = {
          estimatedDeparture: departureTime,
          estimatedArrival: arrivalTime,
          sagaStatus: SagaStatus.PENDING,
          status: 'DELAYED',
          id,
        };
        if (
          (departureTime < flight.departureTime &&
            flight.estimatedDeparture == null) ||
          (flight.estimatedDeparture != null &&
            arrivalTime < flight.estimatedDeparture)
        ) {
          return new HttpException(
            'Estimated departure time cannot be earlier than scheduled departure time',
            500,
          );
        }
        const flightData = await this.flightRepository.updateFlight(
          dateValue,
          tx,
        );

        const sagaPayLoad = {
          flightId: id,
          seats: data.seats,
        };

        await this.amqpConnection.publish(
          'flight-booking-exchange',
          'seats.update',
          sagaPayLoad,
        );

        return flightData;
      }
    });
    return { flight: flightResult };
  }

  async getFlightsInTicketForAdmin(q: string) {
    const flights = await this.flightRepository.searchFlightByName(q);
    return flights;
  }

  async getFlightsAdmin(dto: SearchFlightDto) {
    const { flights, totalPages, currentPage } =
      await this.flightRepository.getFlightsBySearch(dto);
    return {
      flights,
      totalPages,
      currentPage,
    };
  }

  async getFlightsInTicketsForAdmin(dto: FlightForTicketsDto) {
    const { ids } = dto;
    const flights = await this.flightRepository.getFlightsByIds(ids);
    return { flights };
  }

  async getFlightById(id: string) {
    const flight = await this.flightRepository.getFlightById(id);
    return { flight };
  }

  async getFlightsFilterForAdmin(dto: FilterFlightDto) {
    const { flights, totalPages, currentPage } =
      await this.flightRepository.filterFlightsBySearch(dto);
    return {
      flights,
      totalPages,
      currentPage,
    };
  }

  async countFlights() {
    const count = await this.flightRepository.countFlights();
    return { count };
  }

  async countStatusFlights() {
    const count = await this.flightRepository.countStatus();
    return { count };
  }
}
