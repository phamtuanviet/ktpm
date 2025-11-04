import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';

export class SearchAircraftDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  query: string = '';

  @IsOptional()
  @IsString()
  sortBy: string = 'id';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
