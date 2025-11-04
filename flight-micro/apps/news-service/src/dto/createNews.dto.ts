import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
export class CreateNewsDto {
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title: string;

  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  content: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày tạo phải có định dạng hợp lệ (ISO 8601)' })
  createdAt: Date;

  @IsOptional()
  @IsBoolean({ message: 'isPublished phải là boolean' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPublished?: boolean;
}
