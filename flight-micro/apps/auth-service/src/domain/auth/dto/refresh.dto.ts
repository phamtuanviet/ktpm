import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty({ message: 'Device Info không được để trống' })
  deviceInfo: string;
}
