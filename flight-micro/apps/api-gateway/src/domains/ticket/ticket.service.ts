import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'dist/config/services.config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TicketService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
  ) {}

  private readonly baseUrl = SERVICES.BOOKING_SERVICE + '/api/ticket';
  private readonly FLIGHT_URL = SERVICES.FLIGHT_SERVICE + '/api/flight';

  async getTicketFilterForAdmin(@Req() req: Request) {
    const { tickets, totalPages, currentPage } =
      await this.proxyService.forward(
        req,
        `${this.baseUrl}/tickets-filter-admin`,
      );

    const flightIds = tickets
      ?.map((ticket) => ticket.flightSeat?.flightId)
      .filter((id) => !!id);

    const { flights } = (
      await this.httpService.axiosRef.get(
        `${this.FLIGHT_URL}/flights-tickets-admin/`,
        { params: { ids: flightIds } },
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
    const flightIds = tickets
      ?.map((ticket) => ticket.flightSeat?.flightId)
      .filter((id) => !!id);

    const { flights } = (
      await this.httpService.axiosRef.get(
        `${this.FLIGHT_URL}/flights-tickets-admin/`,
        { params: { ids: flightIds } },
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
    return { ticket };
  }

  async cancelTicket(@Req() req: Request) {
    return await this.proxyService.forward(req, `${this.baseUrl}/cancel`);
  }

  async searchTicketForClient(@Req() req: Request) {
    const { tickets } = await this.proxyService.forward(
      req,
      `${this.baseUrl}/tickets-lookup-client`,
    );
    const flightIds = tickets
      ?.map((ticket) => ticket.flightSeat?.flightId)
      .filter((id) => !!id);

    const { flights } = (
      await this.httpService.axiosRef.get(
        `${this.FLIGHT_URL}/flights-tickets-admin/`,
        { params: { ids: flightIds } },
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
      `${this.FLIGHT_URL}/count-tickets-stats`,
    );
  }
}
