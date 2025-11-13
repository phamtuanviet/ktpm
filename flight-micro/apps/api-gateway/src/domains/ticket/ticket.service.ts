import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { SERVICES } from 'src/config/services.config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoggingService } from 'src/log/logging.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
    private readonly logginService: LoggingService,
  ) {}

  private readonly baseUrl = SERVICES.BOOKING_SERVICE + '/api/ticket';
  private readonly FLIGHT_URL = SERVICES.FLIGHT_SERVICE + '/api/flight';

  async getTicketFilterForAdmin(@Req() req: Request) {
    const { tickets, totalPages, currentPage } =
      await this.proxyService.forward(
        req,
        `${this.baseUrl}/tickets-filter-admin`,
      );
    if (tickets.length === 0) {
      return { tickets, totalPages, currentPage };
    }
    const flightIds = tickets
      ?.map((ticket) => ticket.flightSeat?.flightId)
      .filter((id) => !!id);

    const { flights } = (
      await this.httpService.axiosRef.get(
        `${this.FLIGHT_URL}/flights-tickets-admin/`,
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

    const ticketsWithFlights = tickets.map((ticket) => {
      const flightId = ticket.flightSeat?.flightId;
      const flight = flights.find((f) => f.id === flightId);
      return {
        ...ticket,
        flight,
      };
    });
    return { tickets: ticketsWithFlights, totalPages, currentPage };
  }

  async getTicketForAdmin(@Req() req: Request) {
    const { tickets, totalPages, currentPage } =
      await this.proxyService.forward(req, `${this.baseUrl}/tickets-admin`);

    if (tickets.length === 0) {
      return { tickets, totalPages, currentPage };
    }
    const flightIds = tickets
      ?.map((ticket) => ticket.flightSeat?.flightId)
      .filter((id) => !!id);

    const { flights } = (
      await this.httpService.axiosRef.get(
        `${this.FLIGHT_URL}/flights-tickets-admin/`,
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

    const ticketsWithFlights = tickets.map((ticket) => {
      const flightId = ticket.flightSeat?.flightId;
      const flight = flights.find((f) => f.id === flightId);
      return {
        ...ticket,
        flight,
      };
    });
    return { tickets: ticketsWithFlights, totalPages, currentPage };
  }

  async getTicketById(@Req() req: Request) {
    const { ticket } = await this.proxyService.forward(
      req,
      `${this.baseUrl}/${req.params.id}`,
    );
    const { flight } = (
      await this.httpService.axiosRef.get(
        `${this.FLIGHT_URL}/${ticket.flightSeat?.flightId}`,
      )
    ).data;

    const ticketWithFlight = {
      ...ticket,
      flight,
    };
    return { ticket: ticketWithFlight };
  }

  async cancelTicket(@Req() req: Request) {
    return await this.proxyService.forward(req, `${this.baseUrl}/cancel`);
  }

  async searchTicketForClient(@Req() req: Request) {
    const { tickets } = await this.proxyService.forward(
      req,
      `${this.baseUrl}/tickets-lookup-client`,
    );
    if (tickets.length === 0) {
      return { tickets: [] };
    }
    const flightIds = tickets
      ?.map((ticket) => ticket.flightSeat?.flightId)
      .filter((id) => !!id);

    const { flights } = (
      await this.httpService.axiosRef.get(
        `${this.FLIGHT_URL}/flights-tickets-admin/`,
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

    const ticketsWithFlights = tickets.map((ticket) => {
      const flightId = ticket.flightSeat?.flightId;
      const flight = flights.find((f) => f.id === flightId);
      return {
        ...ticket,
        flight,
      };
    });

    return { tickets: ticketsWithFlights };
  }

  async countTicketStats(@Req() req: Request) {
    return await this.proxyService.forward(
      req,
      `${this.baseUrl}/count-tickets-stats`,
    );
  }

  async getRevenueStats(@Req() req: Request) {
    const { result } = await this.proxyService.forward(
      req,
      `${this.baseUrl}/revenue-stats`,
    );
    return { result };
  }
}
