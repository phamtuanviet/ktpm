import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAircraftDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  manufacturer: string;
}
