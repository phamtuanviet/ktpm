import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class GetSeatsByFlightsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
