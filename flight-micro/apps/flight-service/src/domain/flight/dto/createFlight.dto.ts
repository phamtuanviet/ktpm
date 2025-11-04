import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateFlightSeatDto } from './flightSeat.dto';

export class CreateFlightDto {
  @IsOptional()
  @IsString()
  flightNumber?: string;

  @Type(() => Date)
  @IsDate()
  departureTime: Date;

  @Type(() => Date)
  @IsDate()
  arrivalTime: Date;

  @IsString()
  departureAirport: string;

  @IsString()
  arrivalAirport: string;

  @IsString()
  aircraft: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlightSeatDto)
  seats: CreateFlightSeatDto[];
}
