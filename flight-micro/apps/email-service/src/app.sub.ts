import { Injectable } from '@nestjs/common';
import { AppService } from './app.service';
import { Payload } from '@nestjs/microservices';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

const EMAIL_EXCHANGE = 'email-exchange';

@Injectable()
export class AppSubService {
  constructor(private readonly appService: AppService) {}

  @RabbitSubscribe({
    exchange: EMAIL_EXCHANGE,
    routingKey: 'send-verification-email',
    queue: 'send-verification-email-queue',
  })
  async handleVerificationEmail(
    @Payload() data: { email: string; code: string },
  ) {
    await this.appService.sendVerificationEmail(data.email, data.code);
  }

  @RabbitSubscribe({
    exchange: EMAIL_EXCHANGE,
    routingKey: 'send-verification-reset-password',
    queue: 'send-verification-reset-password-queue',
  })
  async handleResetPasswordEmail(
    @Payload() data: { email: string; code: string },
  ) {
    await this.appService.sendResetPasswordEmail(data.email, data.code);
  }

  @RabbitSubscribe({
    exchange: EMAIL_EXCHANGE,
    routingKey: 'send-otp-booking',
    queue: 'send-otp-booking-queue',
  })
  async handleSendOtpForBooking(
    @Payload() data: { email: string; code: string },
  ) {
    await this.appService.sendOtpForBooking(data.email, data.code);
  }

  @RabbitSubscribe({
    exchange: EMAIL_EXCHANGE,
    routingKey: 'send-booking-confirmation',
    queue: 'send-booking-confirmation-queue',
  })
  async handleBookingConfirmation(
    @Payload()
    data: {
      email: string;
      tickets: any[];
      flightDataEmail: {
        departureAirport: string;
        arrivalAirport: string;
        outboundFlightNumber: string;
        inboundFlightNumber?: string;
        outboundFlightId: string;
        inboundFlightId?: string;
      };
    },
  ) {
    await this.appService.sendBookingConfirmation(
      data.email,
      data.tickets,
      data.flightDataEmail,
    );
  }
}
