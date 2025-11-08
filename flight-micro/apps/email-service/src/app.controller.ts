import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('send-verification-email')
  async handleVerificationEmail(
    @Payload() data: { email: string; code: string },
  ) {
    await this.appService.sendVerificationEmail(data.email, data.code);
  }

  @EventPattern('send-verification-reset-password')
  async handleResetPasswordEmail(
    @Payload() data: { email: string; code: string },
  ) {
    await this.appService.sendResetPasswordEmail(data.email, data.code);
  }

  @EventPattern('send-otp-booking')
  async handleSendOtpForBooking(
    @Payload() data: { email: string; code: string },
  ) {
    await this.appService.sendOtpForBooking(data.email, data.code);
  }

  @EventPattern('send-booking-confirmation')
  async handleBookingConfirmation(
    @Payload()
    data: {
      email: string;
      tickets: any[];
      flightDataEmail: {
        departureAirport: string;
        arrivalAirport: string;
        outBoundFlightNumber: string;
        inBoundFlightNumber?: string;
        outBoundFlightId: string;
        inBoundFlightId?: string;
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
