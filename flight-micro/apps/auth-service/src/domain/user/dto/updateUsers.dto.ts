import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsIn,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'ID không được để trống.' })
  @IsString({ message: 'ID phải là chuỗi ký tự.' })
  readonly id: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'isVerified phải là giá trị boolean (true/false).' })
  readonly isVerified?: boolean;

  @IsOptional()
  @IsString({ message: 'Role phải là chuỗi ký tự.' })
  @IsIn(['USER', 'ADMIN'], {
    message: 'Role phải là một trong các giá trị: USER hoặc ADMIN.',
  })
  readonly role?: 'USER' | 'ADMIN';

  @IsOptional()
  @IsString({ message: 'Name phải là chuỗi ký tự.' })
  readonly name?: string;
}
