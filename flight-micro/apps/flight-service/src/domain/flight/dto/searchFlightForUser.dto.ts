import { IsString, IsOptional, IsIn, IsDateString, IsInt, Min } from 'class-validator';

export class SearchFlightForUserDto {
  @IsIn(['oneway', 'twoway'])
  tripType: 'oneway' | 'twoway';

  @IsString()
  departureAirport: string;

  @IsString()
  arrivalAirport: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  adults: number = 1;

  @IsOptional()
  @IsInt()
  children: number = 0;

  @IsOptional()
  @IsInt()
  infants: number = 0;
}
