import { HttpService } from '@nestjs/axios';
import { Injectable, Req } from '@nestjs/common';
import { SERVICES } from 'dist/config/services.config';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';

@Injectable()
export class FlightService {
  private readonly baseUrl = SERVICES.FLIGHT_SERVICE + '/api/flight';
  private readonly bookingUrl = SERVICES.BOOKING_SERVICE + '/api/ticket';

  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
  ) {}

  async createFlightByAdmin(@Req() req: Request) {
    const { flight } = await this.proxyService.forward(req, this.baseUrl + '/');
    return { flight };
  }

  async updateFlight(@Req() req: Request) {
    const { flight } = await this.proxyService.forward(req, this.baseUrl + '/');
    return { flight };
  }

  async getFlightsInTicketForAdmin(@Req() req: Request) {
    const { flights } = await this.proxyService.forward(
      req,
      this.bookingUrl + `flights-ticket-admin/${req.params.q}`,
    );
    return { flights };
  }

  async getFlightsAdmin(@Req() req: Request) {
    const { flights, totalPages, currentPage } =
      await this.proxyService.forward(req, this.baseUrl + '/flights-admin');

    const flightIds = flights.map((flight) => flight.id);

    const { seats } = (
      await this.httpService.axiosRef.get(
        `${this.bookingUrl}/flights-tickets-admin/`,
        { params: { ids: flightIds } },
      )
    ).data;

    const lastFlights = flights.map((flight) => {
      const flightSeats = seats.find((seat) => seat.flightId === flight.id);
      return { ...flight, seats: flightSeats?.seats };
    });

    return { flights: lastFlights, totalPages, currentPage };
  }

  async getFlightById(@Req() req: Request) {
    const { flight } = await this.proxyService.forward(
      req,
      this.baseUrl + `${req.params.id}`,
    );
    const flightIds = flight.map((flight) => flight.id);

    const { seats } = (
      await this.httpService.axiosRef.get(
        `${this.bookingUrl}/flights-tickets-admin/`,
        { params: { ids: flightIds } },
      )
    ).data;

    const lastFlights = flight.map((flight) => {
      const flightSeats = seats.find((seat) => seat.flightId === flight.id);
      return { ...flight, seats: flightSeats?.seats };
    });

    return { flight: lastFlights };
  }

  async getFlightsFilterForAdmin(@Req() req: Request) {
    const { flights, totalPages, currentPage } =
      await this.proxyService.forward(
        req,
        this.baseUrl + '/flights-filter-admin',
      );

    const flightIds = flights.map((flight) => flight.id);

    const { seats } = (
      await this.httpService.axiosRef.get(
        `${this.bookingUrl}/flights-tickets-admin/`,
        { params: { ids: flightIds } },
      )
    ).data;

    const lastFlights = flights.map((flight) => {
      const flightSeats = seats.find((seat) => seat.flightId === flight.id);
      return { ...flight, seats: flightSeats?.seats };
    });

    return { flights: lastFlights, totalPages, currentPage };
  }

  async getFlightsForClient(@Req() req: Request) {
    const { flights } = await this.proxyService.forward(
      req,
      this.baseUrl + '/flights-client',
    );

    const flightIds = flights.map((flight) => flight.id);
    const { seats } = (
      await this.httpService.axiosRef.get(
        `${this.bookingUrl}/flights-tickets-admin/`,
        { params: { ids: flightIds } },
      )
    ).data;

    const lastFlights = flights.map((flight) => {
      const flightSeats = seats.find((seat) => seat.flightId === flight.id);
      return { ...flight, seats: flightSeats?.seats };
    });

    return { flights: lastFlights };
  }

  async countFlights(@Req() req: Request) {
    const { count } = await this.proxyService.forward(
      req,
      this.baseUrl + '/count',
    );
    return { count };
  }

  async countStatusFlights(@Req() req: Request) {
    const { count } = await this.proxyService.forward(
      req,
      this.baseUrl + '/count-status',
    );
    return { count };
  }
}
