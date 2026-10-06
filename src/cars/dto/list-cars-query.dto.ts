import { IsOptional, IsString } from 'class-validator';

export class ListCarsQueryDto {
  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  brand?: string;
}
