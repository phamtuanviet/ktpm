import {
  IsString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class SignBookingDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
