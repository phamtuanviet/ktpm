import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { ProxyService } from 'src/proxy/proxy.service';
import type { Request } from 'express';
import { SERVICES } from 'src/config/services.config';
import { HttpService } from '@nestjs/axios';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { LoggingService } from 'src/log/logging.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
    private readonly logginService: LoggingService,
  ) {}

  private readonly baseUrl = SERVICES.BOOKING_SERVICE + '/api/booking';
  private readonly FLIGHT_URL = SERVICES.FLIGHT_SERVICE + '/api/flight';

  async bookingSign(@Req() req: Request) {
    return await this.proxyService.forward(req, this.baseUrl + '/booking-sign');
  }

  async bookingVerify(@Req() req: Request) {
    try {
      const flightIds = [
        req.body.outboundFlightId,
        req.body.inboundFlightId,
      ].filter(Boolean);

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

      const outboundFlight = flights.find(
        (f) => f.id === req.body.outboundFlightId,
      );
      const inboundFlight = flights.find(
        (f) => f.id === req.body.inboundFlightId,
      );

      req.body = {
        ...req.body,
        departureAirport: outboundFlight.departureAirport.name,
        arrivalAirport: outboundFlight.arrivalAirport.name,
        outboundFlightNumber: outboundFlight.flightNumber,
        inboundFlightNumber: inboundFlight?.flightNumber,
      };

      const result = await this.proxyService.forward(
        req,
        this.baseUrl + '/booking-verify',
      );
      this.logginService.log('Booking verified successfully', {
        body: result.tickets,
      });
      return result;
    } catch (error) {
      this.logginService.error('Error during booking verification', {
        error,
        body: req.body,
      });
      error._logged = true;
      throw error;
    }
  }
}
