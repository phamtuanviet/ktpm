import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Name không được để trống' })
  @MinLength(2, { message: 'Name phải có ít nhất 2 ký tự' })
  name: string;
}
