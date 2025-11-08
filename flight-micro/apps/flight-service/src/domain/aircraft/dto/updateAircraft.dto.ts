import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAircraftDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;
}
