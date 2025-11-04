import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAircraftDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;
}
