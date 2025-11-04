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
  outBoundFlightId: string;

  @IsEnum(SeatClass)
  outBoundSeatClass: SeatClass;

  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  inBoundFlightId?: string;

  @IsOptional()
  @IsEnum(SeatClass)
  inBoundSeatClass?: SeatClass;
}
