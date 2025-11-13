import { HttpService } from '@nestjs/axios';
import { Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoggingService } from 'src/log/logging.service';

@Injectable()
export class FlightService {
  private readonly baseUrl = SERVICES.FLIGHT_SERVICE + '/api/flight';
  private readonly bookingUrl = SERVICES.BOOKING_SERVICE + '/api/flight-seat';

  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
    private readonly logginService: LoggingService,
  ) {}

  async createFlightByAdmin(@Req() req: Request) {
    try {
      const { flight } = await this.proxyService.forward(
        req,
        this.baseUrl + '/',
      );
      this.logginService.log('Flight created successfully', {
        body: flight,
      });
      return { flight };
    } catch (error) {
      this.logginService.error('Error creating flight', {
        error,
        body: req.body,
      });
      error._logged = true;
      throw error;
    }
  }

  async updateFlight(@Req() req: Request) {
    try {
      const result = await this.proxyService.forward(
        req,
        this.baseUrl + `/${req.params.id}`,
      );
      this.logginService.log('Flight updated successfully', {
        body: result.flight,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error updating flight', {
        error,
        body: { ...req.body, id: req.params.id },
      });
      error._logged = true;
      throw error;
    }
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

    if (flights.length === 0) return { flights, totalPages, currentPage };

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
      const totalSeats = flightSeats.reduce(
        (sum, seat) => sum + seat.totalSeats,
        0,
      );
      const bookedSeats = flightSeats.reduce(
        (sum, seat) => sum + seat.bookedSeats,
        0,
      );

      return {
        ...flight,
        seats: flightSeats,
        totalSeats,
        bookedSeats,
      };
    });

    return { flights: lastFlights, totalPages, currentPage };
  }

  async getFlightById(@Req() req: Request) {
    const { flight } = await this.proxyService.forward(
      req,
      this.baseUrl + `/${req.params.id}`,
    );
    if (!flight) return { flight };
    const flightIds = [flight.id];

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

    const lastFlight = { ...flight, seats };

    return { flight: lastFlight };
  }

  async getFlightsFilterForAdmin(@Req() req: Request) {
    const { flights, totalPages, currentPage } =
      await this.proxyService.forward(
        req,
        this.baseUrl + '/flights-filter-admin',
      );

    if (flights.length === 0) return { flights, totalPages, currentPage };

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
      const totalSeats = flightSeats.reduce(
        (sum, seat) => sum + seat.totalSeats,
        0,
      );
      const bookedSeats = flightSeats.reduce(
        (sum, seat) => sum + seat.bookedSeats,
        0,
      );

      return {
        ...flight,
        seats: flightSeats,
        totalSeats,
        bookedSeats,
      };
    });

    return { flights: lastFlights, totalPages, currentPage };
  }

  async getFlightsForClient(@Req() req: Request) {
    const { inbound, outbound, tripType } = await this.proxyService.forward(
      req,
      this.baseUrl + '/flights-client',
    );

    // 2. Kiểm tra rỗng và Early Return
    // Kiểm tra nếu một trong hai mảng không tồn tại hoặc rỗng
    if (
      (!inbound ||
        inbound.length === 0 ||
        !outbound ||
        outbound.length === 0) &&
      tripType === 'twoway'
    ) {
      return { inbound: [], outbound: [] };
    }

    // 3. Lấy tất cả IDs của cả hai chiều
    const allFlightIds = [
      ...outbound.map((flight) => flight.id),
      ...inbound.map((flight) => flight.id),
    ];

    // 4. Lấy thông tin Ghế (Flight Seats)
    let allSeats: any[] = [];
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.bookingUrl}/flight-seats-flights`,
        {
          params: { ids: allFlightIds },
          paramsSerializer: (params) => {
            return Object.keys(params)
              .map((key) =>
                params[key].map((v: string) => `${key}=${v}`).join('&'),
              )
              .join('&');
          },
        },
      );
      allSeats = response.data.seats || [];
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chỗ ngồi:', error.message);
      return { inbound: [], outbound: [] };
    }

    const flightsWithSeats = (flightArray: any[]) => {
      return flightArray.map((flight) => {
        const seatData = allSeats.filter((seat) => seat.flightId === flight.id);

        return {
          ...flight,
          seats: seatData || [],
        };
      });
    };

    // 6. Gắn ghép cho từng mảng và trả về kết quả cuối cùng
    return {
      outbound: flightsWithSeats(outbound),
      inbound: flightsWithSeats(inbound),
    };
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
