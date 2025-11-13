import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SeatClass } from 'generated/prisma';
import { CreatePassengerDto } from 'src/domain/passenger/dto/createPassenger.dto';

export class CreateBookingDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePassengerDto)
  passengers: CreatePassengerDto[];

  @IsString()
  outboundFlightId: string;

  @IsEnum(SeatClass)
  outboundSeatClass: SeatClass;

  @IsString()
  departureAirport: string;

  @IsString()
  arrivalAirport: string;

  @IsString()
  outboundFlightNumber: string;

  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  inboundFlightId?: string;

  @IsOptional()
  @IsEnum(SeatClass)
  inboundSeatClass?: SeatClass;

  @IsString()
  @IsOptional()
  inboundFlightNumber?: string;
}
