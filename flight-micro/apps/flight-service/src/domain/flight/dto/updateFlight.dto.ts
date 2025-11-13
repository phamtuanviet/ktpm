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
  departureTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  arrivalTime?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlightSeatDto)
  seats: CreateFlightSeatDto[];
}
