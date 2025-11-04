import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteAircraftDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
