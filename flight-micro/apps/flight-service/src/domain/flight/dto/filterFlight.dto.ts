import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterFlightDto {
  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  departureAirport?: string;

  @IsOptional()
  @IsString()
  arrivalAirport?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @Type(() => Date)
  departureTime?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @Type(() => Date)
  arrivalTime?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'bookedAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
