import { Type } from 'class-transformer';
import { ValidateNested, IsString, IsArray } from 'class-validator';
import { CreateFlightSeatDto } from './createFlightSeat.dto';

export class CreateFlightSeatsForFlightDto {
  @IsString()
  flightId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlightSeatDto)
  seats: CreateFlightSeatDto[];
}
