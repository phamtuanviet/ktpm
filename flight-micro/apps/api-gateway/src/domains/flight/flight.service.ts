import { HttpService } from '@nestjs/axios';
import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';

@Injectable()
export class FlightService {
  private readonly baseUrl = SERVICES.FLIGHT_SERVICE + '/api/flight';
  private readonly bookingUrl = SERVICES.BOOKING_SERVICE + '/api/flight-seat';

  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
  ) {}

  async createFlightByAdmin(@Req() req: Request) {
    const { flight } = await this.proxyService.forward(req, this.baseUrl + '/');
    return { flight };
  }

  async updateFlight(@Req() req: Request) {
    const { flight } = await this.proxyService.forward(
      req,
      this.baseUrl + `/${req.params.id}`,
    );
    return { flight };
  }

  async getFlightsInTicketForAdmin(@Req() req: Request) {
    const { flights } = await this.proxyService.forward(
      req,
      this.baseUrl + `/flights-ticket-admin/${req.params.q}`,
    );
    return { flights };
  }

  async getFlightsAdmin(@Req() req: Request) {
    const { flights, totalPages, currentPage } =
      await this.proxyService.forward(req, this.baseUrl + '/flights-admin');

    const flightIds = flights.map((flight) => flight.id);

    const { seats } = (
      await this.httpService.axiosRef.get(
        `${this.bookingUrl}/flight-seats-flights`,
        {
          params: { ids: flightIds },
          paramsSerializer: (params) => {
            return Object.keys(params)
              .map((key) =>
                params[key].map((v: string) => `${key}=${v}`).join('&'),
              )
              .join('&');
          },
        },
      )
    ).data;

    console.log(seats);

    const lastFlights = flights.map((flight) => {
      const flightSeats = seats.filter((seat) => seat.flightId === flight.id);
      return { ...flight, seats: flightSeats };
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
        `${this.bookingUrl}/flight-seats-flights`,
        {
          params: { ids: flightIds },
          paramsSerializer: (params) => {
            return Object.keys(params)
              .map((key) =>
                params[key].map((v: string) => `${key}=${v}`).join('&'),
              )
              .join('&');
          },
        },
      )
    ).data;

    const lastFlights = flight.map((flight) => {
      const flightSeats = seats.filter((seat) => seat.flightId === flight.id);
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
        `${this.bookingUrl}/flight-seats-flights`,
        {
          params: { ids: flightIds },
          paramsSerializer: (params) => {
            return Object.keys(params)
              .map((key) =>
                params[key].map((v: string) => `${key}=${v}`).join('&'),
              )
              .join('&');
          },
        },
      )
    ).data;

    const lastFlights = flights.map((flight) => {
      const flightSeats = seats.filter((seat) => seat.flightId === flight.id);
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
        `${this.bookingUrl}/flight-seats-flights`,
        {
          params: { ids: flightIds },
          paramsSerializer: (params) => {
            return Object.keys(params)
              .map((key) =>
                params[key].map((v: string) => `${key}=${v}`).join('&'),
              )
              .join('&');
          },
        },
      )
    ).data;

    const lastFlights = flights.map((flight) => {
      const flightSeats = seats.filter((seat) => seat.flightId === flight.id);
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
