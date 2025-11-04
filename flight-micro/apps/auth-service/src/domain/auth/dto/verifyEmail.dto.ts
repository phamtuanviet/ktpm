import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty({ message: 'ID không được để trống' })
  id: string;

  @IsNotEmpty({ message: 'OTP không được để trống' })
  @IsNumberString({}, { message: 'OTP phải là số' })
  @Length(6, 6, { message: 'OTP phải có đúng 6 chữ số' })
  otp: string;

  @IsNotEmpty({ message: 'Device Info không được để trống' })
  deviceInfo: string;
}
