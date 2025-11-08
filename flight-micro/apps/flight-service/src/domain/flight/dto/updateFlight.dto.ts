import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateFlightSeatDto } from './flightSeat.dto';

export class UpdateFlightDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  estimatedDeparture?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  estimatedArrival?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlightSeatDto)
  seats: CreateFlightSeatDto[];
}
