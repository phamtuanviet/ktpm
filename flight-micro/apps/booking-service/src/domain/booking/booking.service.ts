import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FlightSeatService } from '../flightSeat/flightSeat.service';
import { PassengerService } from '../passenger/passenger.service';
import { TicketService } from '../ticket/ticket.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from 'src/redis/redis.service';
import { CreatePassengerDto } from '../passenger/dto/createPassenger.dto';
import { SeatClass } from 'generated/prisma';
import { CreateBookingDto } from './dto/createBooking.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
@Injectable()
export class BookingService {
  constructor(
    private readonly flightSeatService: FlightSeatService,
    private readonly passengerService: PassengerService,
    private readonly ticketService: TicketService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    // @Inject('logging-queue') private readonly loggingQueue: ClientProxy,
    private readonly amqpConnection: AmqpConnection,

    // @Inject('email-queue') private readonly emailQueue: ClientProxy,
  ) {}

  safeMapTicket(ticket: any) {
    const { cancelCode, ...rest } = ticket;
    return rest;
  }

  async signBuyTickets(email: string) {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.redisService.set(
      `email-verification-buy-tickets:${email}`,
      newOtp,
      15 * 60,
    );
    // this.emailQueue.emit('send-otp-booking', {
    //   email,
    //   code: newOtp,
    // });

    await this.amqpConnection.publish('email-exchange', 'send-otp-booking', {
      email,
      code: newOtp,
    });

    return {
      message: 'OTP sent to your email',
    };
  }

  async verifyBuyTickets(email: string, otp: string) {
    const isOtpValid = await this.redisService.get(
      `email-verification-buy-tickets:${email}`,
    );
    if (isOtpValid == otp) {
      await this.redisService.del(`email-verification-buy-tickets:${email}`);
      return true;
    } else {
      return false;
    }
  }

  async buyTickets(dto: CreateBookingDto, email: string) {
    const {
      outboundFlightId,
      inboundFlightId,
      outboundSeatClass,
      inboundSeatClass,
      passengers,
      otp,
    } = dto;
    const nums = passengers.filter((p) => p.passengerType !== 'INFANT').length;
    const isOtpValid = await this.verifyBuyTickets(email, otp);
    if (isOtpValid) {
      const data = await this.prismaService.$transaction(async (tx) => {
        const passengerRecords = await Promise.all(
          passengers.map((passenger) => {
            return this.passengerService.createPassenger(passenger, email, tx);
          }),
        );

        const { flightSeat: outboundFlightSeat } =
          await this.flightSeatService.getFlightSeatsByFlightIdAndSeatType(
            outboundFlightId,
            outboundSeatClass,
            tx,
          );

        if (
          outboundFlightSeat.totalSeats <
          outboundFlightSeat.bookedSeats + nums
        ) {
          throw new HttpException('Not enough seats', 400);
        }

        const ticketRecords: { ticket: any }[] = [];

        const outTicketRecords = await Promise.all(
          passengerRecords.map((passenger, index) => {
            const prefix = outboundFlightSeat.seatClass.charAt(0);
            const number = outboundFlightSeat.bookedSeats + index + 1;
            let seatNumber = prefix + number;
            if (passenger.passengerType === 'INFANT') {
              seatNumber = null;
            }
            return this.ticketService.createTicket(
              passenger.id,
              outboundFlightSeat.id,
              seatNumber,
              tx,
            );
          }),
        );
        ticketRecords.push(...outTicketRecords);
        await this.flightSeatService.updateBookedSeats(
          outboundFlightSeat.id,
          nums,
          tx,
        );

        if (inboundFlightId && inboundSeatClass) {
          const { flightSeat: inboundFlightSeat } =
            await this.flightSeatService.getFlightSeatsByFlightIdAndSeatType(
              inboundFlightId,
              inboundSeatClass,
              tx,
            );

          if (
            inboundFlightSeat.totalSeats <
            inboundFlightSeat.bookedSeats + nums
          ) {
            throw new HttpException('Not enough seats', 400);
          }

          const inTicketRecords = await Promise.all(
            passengerRecords.map((passenger, index) => {
              const prefix = inboundFlightSeat.seatClass.charAt(0);
              const number = inboundFlightSeat.bookedSeats + index + 1;
              let seatNumber = prefix + number;
              if (passenger.passengerType == 'INFANT') {
                seatNumber = null;
              }
              return this.ticketService.createTicket(
                passenger.id,
                inboundFlightSeat.id,
                seatNumber,
                tx,
              );
            }),
          );
          ticketRecords.push(...inTicketRecords);
          await this.flightSeatService.updateBookedSeats(
            inboundFlightSeat.id,
            nums,
            tx,
          );
        }

        const flightDataEmail = {
          departureAirport: dto.departureAirport,
          arrivalAirport: dto.arrivalAirport,
          outboundFlightNumber: dto.outboundFlightNumber,
          inboundFlightNumber: dto.inboundFlightNumber,
          outboundFlightId,
          inboundFlightId,
        };

        // this.emailQueue.emit('send-booking-confirmation', {
        //   email,
        //   tickets: ticketRecords,
        //   flightDataEmail,
        // });

        await this.amqpConnection.publish(
          'email-exchange',
          'send-booking-confirmation',
          {
            email,
            tickets: ticketRecords,
            flightDataEmail,
          },
        );

        const safeTickets = ticketRecords.map((t) => this.safeMapTicket(t));

        return safeTickets;
      });
      return { tickets: data };
    } else {
      throw new HttpException('Invalid OTP Booking', 400);
    }
  }
}
