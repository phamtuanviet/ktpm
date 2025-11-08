import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { PassengerType } from 'generated/prisma';

export class CreatePassengerDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Name không được để trống' })
  @Matches(/^[\p{L}\s]+$/u, { message: 'Name không đúng định dạng' })
  fullName: string;

  @IsOptional()
  passport: string;

  @Type(() => Date)
  @IsDate({ message: 'Ngày sinh không hợp lệ' })
  dob: Date;

  @IsEnum(PassengerType, {
    message: 'Type must be one of: ADULT, CHILD, INFANT',
  })
  passengerType: PassengerType;
}
