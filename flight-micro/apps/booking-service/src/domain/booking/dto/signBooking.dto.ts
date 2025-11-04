import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  Min,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class SignBookingDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
