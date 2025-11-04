import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class LookupTicketDto {
  @IsNotEmpty()
  @IsString()
  query: string;
}
