import { Transform } from 'class-transformer';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class FlightForTicketsDto {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
