import { Transform } from 'class-transformer';
import { IsArray, IsString, ArrayNotEmpty, IsOptional } from 'class-validator';

export class FlightForTicketsDto {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  @IsArray()
  // @ArrayNotEmpty()
  @IsOptional()
  @IsString({ each: true })
  ids: string[];
}
