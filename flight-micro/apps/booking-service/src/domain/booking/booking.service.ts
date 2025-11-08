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
@Injectable()
export class BookingService {
  constructor(
    private readonly flightSeatService: FlightSeatService,
    private readonly passengerService: PassengerService,
    private readonly ticketService: TicketService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    @Inject('logging-queue') private readonly loggingQueue: ClientProxy,
    @Inject('email-queue') private readonly emailQueue: ClientProxy,
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
    this.emailQueue.emit('send-otp-booking', {
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

  async buyTickets(dto: CreateBookingDto) {
    const {
      outBoundFlightId,
      inBoundFlightId,
      outBoundSeatClass,
      inBoundSeatClass,
      passengers,
      otp,
    } = dto;
    const email = passengers[0].email;
    const nums = passengers.filter((p) => p.passengerType !== 'INFANT').length;
    const isOtpValid = await this.verifyBuyTickets(email, otp);
    if (isOtpValid) {
      const data = await this.prismaService.$transaction(async (tx) => {
        const passengerRecords = await Promise.all(
          passengers.map((passenger) => {
            return this.passengerService.createPassenger(passenger, tx);
          }),
        );

        const { flightSeat: outBoundFlightSeat } =
          await this.flightSeatService.getFlightSeatsByFlightIdAndSeatType(
            outBoundFlightId,
            outBoundSeatClass,
            tx,
          );

        console.log(outBoundFlightSeat);

        if (
          outBoundFlightSeat.totalSeats <
          outBoundFlightSeat.bookedSeats + nums
        ) {
          throw new HttpException('Not enough seats', 400);
        }

        const ticketRecords: { ticket: any }[] = [];

        const outTicketRecords = await Promise.all(
          passengerRecords.map((passenger, index) => {
            const prefix = outBoundFlightSeat.seatClass.charAt(0);
            const number = outBoundFlightSeat.bookedSeats + index + 1;
            let seatNumber = prefix + number;
            if (passenger.passengerType === 'INFANT') {
              seatNumber = null;
            }
            return this.ticketService.createTicket(
              passenger.id,
              outBoundFlightSeat.id,
              seatNumber,
              tx,
            );
          }),
        );
        console.log(outTicketRecords);
        ticketRecords.push(...outTicketRecords);
        await this.flightSeatService.updateBookedSeats(
          outBoundFlightSeat.id,
          nums,
          tx,
        );

        if (inBoundFlightId && inBoundSeatClass) {
          const { flightSeat: inBoundFlightSeat } =
            await this.flightSeatService.getFlightSeatsByFlightIdAndSeatType(
              inBoundFlightId,
              inBoundSeatClass,
              tx,
            );

          if (
            inBoundFlightSeat.totalSeats <
            inBoundFlightSeat.bookedSeats + nums
          ) {
            throw new HttpException('Not enough seats', 400);
          }

          const inTicketRecords = await Promise.all(
            passengerRecords.map((passenger, index) => {
              const prefix = inBoundFlightSeat.seatClass.charAt(0);
              const number = inBoundFlightSeat.bookedSeats + index + 1;
              let seatNumber = prefix + number;
              if (passenger.passengerType == 'INFANT') {
                seatNumber = null;
              }
              return this.ticketService.createTicket(
                passenger.id,
                inBoundFlightSeat.id,
                seatNumber,
                tx,
              );
            }),
          );
          ticketRecords.push(...inTicketRecords);
          await this.flightSeatService.updateBookedSeats(
            inBoundFlightSeat.id,
            nums,
            tx,
          );
        }

        const flightDataEmail = {
          departureAirport: dto.departureAirport,
          arrivalAirport: dto.arrivalAirport,
          outBoundFlightNumber: dto.outBoundFlightNumber,
          inBoundFlightNumber: dto.inBoundFlightNumber,
          outBoundFlightId,
          inBoundFlightId,
        };

        this.emailQueue.emit('send-booking-confirmation', {
          email,
          tickets: ticketRecords,
          flightDataEmail,
        });

        const safeTickets = ticketRecords.map((t) => this.safeMapTicket(t));

        return safeTickets;
      });
      return { tickets: data };
    } else {
      throw new HttpException('Invalid OTP Booking', 400);
    }
  }
}
