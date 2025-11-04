import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateNewsDto {
  @IsNotEmpty({ message: 'ID không được để trống' })
  id: string;

  @IsOptional()
  title: string;

  @IsOptional()
  content: string;

  @IsOptional()
  @IsBoolean({ message: 'isPublished phải là boolean' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isPublished?: boolean;
}
