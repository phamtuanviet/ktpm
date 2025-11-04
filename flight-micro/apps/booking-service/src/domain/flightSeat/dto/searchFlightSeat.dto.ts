import { IsNotEmpty } from 'class-validator';

export class SearchFlightSeatDto {
  @IsNotEmpty({ message: 'Id không được để trống' })
  id: string;
}
