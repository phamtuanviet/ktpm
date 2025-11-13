import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsIn,
  IsEmail,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PassengerType, SeatClass } from 'generated/prisma';

export class FilterTicketDto {
  @IsOptional()
  @IsEnum(SeatClass)
  seatClass: SeatClass;

  @IsOptional()
  @IsEnum(PassengerType)
  passengerType: PassengerType;

  @IsOptional()
  @IsString()
  passengerName: string;


  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  passengerEmail?: string;

  @IsOptional()
  @IsBoolean({ message: 'isCancel phải là boolean' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isCancelled?: boolean;

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
