import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
export class UpdateNewsDto {

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
