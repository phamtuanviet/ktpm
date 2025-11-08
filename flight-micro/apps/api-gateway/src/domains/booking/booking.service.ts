import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BookingService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
  ) {}

  private readonly baseUrl = SERVICES.BOOKING_SERVICE + '/api/booking';
  private readonly FLIGHT_URL = SERVICES.FLIGHT_SERVICE + '/api/flight';

  async bookingSign(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/booking-sign');
  }

  async bookingVerify(@Req() req: Request) {
    const flightIds = [
      req.body.outBoundFlightId,
      req.body.inBoundFlightId,
    ].filter(Boolean);

    console.log(flightIds);

    if (!flightIds.length) {
      throw new BadRequestException('Missing flight IDs');
    }

    const { flights } = (
      await this.httpService.axiosRef.get(
        `${this.FLIGHT_URL}/flights-tickets-admin`,
        {
          params: {
            ids: flightIds,
          },
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

    const outBoundFlight = flights.find(
      (f) => f.id === req.body.outBoundFlightId,
    );
    const inBoundFlight = flights.find(
      (f) => f.id === req.body.inBoundFlightId,
    );

    req.body = {
      ...req.body,
      departureAirport: outBoundFlight.departureAirport.name,
      arrivalAirport: outBoundFlight.arrivalAirport.name,
      outBoundFlightNumber: outBoundFlight.flightNumber,
      inBoundFlightNumber: inBoundFlight?.flightNumber,
    };

    return await this.proxyService.forward(
      req,
      this.baseUrl + '/booking-verify',
    );
  }
}
