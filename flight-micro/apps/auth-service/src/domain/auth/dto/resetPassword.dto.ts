import { IsNotEmpty, MinLength } from 'class-validator';
export class ResetPasswordDto {

  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  newPassword: string;

  @IsNotEmpty({ message: 'Device Info không được để trống' })
  deviceInfo: string;
}
