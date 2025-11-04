import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class FlightForTicketsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
