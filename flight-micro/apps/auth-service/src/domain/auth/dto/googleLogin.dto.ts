import { IsEmail, IsNotEmpty } from 'class-validator';

export class GoogleLoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsNotEmpty({ message: 'Provider không được để trống' })
  provider: string;

  @IsNotEmpty({ message: 'Provider ID không được để trống' })
  providerId: string;

  @IsNotEmpty({ message: 'Name không được để trống' })
  name: string;

  @IsNotEmpty({ message: 'Device Info không được để trống' })
  deviceInfo: string;
}
