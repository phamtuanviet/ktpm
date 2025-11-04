import { IsString, IsNotEmpty } from 'class-validator';

export class CancelTicketDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  cancelCode: string;
}
