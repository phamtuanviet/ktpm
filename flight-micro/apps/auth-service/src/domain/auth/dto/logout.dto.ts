import { IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsNotEmpty({ message: 'ID không được để trống' })
  id: string;
}
