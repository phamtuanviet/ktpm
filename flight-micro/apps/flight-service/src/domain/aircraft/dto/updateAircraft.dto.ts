import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAircraftDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;
}
