import { IsOptional, IsString } from 'class-validator';

export class RefreshAccessDto {
  @IsOptional()
  @IsString()
  id?: string;
}
