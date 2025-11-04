import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterTicketDto {
  @IsOptional()
  @IsString()
  flightId?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean({ message: 'isCancel phải là boolean' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isCancel?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'bookedAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
