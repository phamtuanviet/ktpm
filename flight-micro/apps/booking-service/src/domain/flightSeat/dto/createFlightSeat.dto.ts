import { IsEnum, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum SeatClass {
  ECONOMY = 'ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST_CLASS = 'FIRST_CLASS',
}

export class CreateFlightSeatDto {
  @IsEnum(SeatClass)
  seatClass: SeatClass;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalSeats: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}
