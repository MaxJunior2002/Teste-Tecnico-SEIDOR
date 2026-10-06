import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListDriversQueryDto {
  @ApiPropertyOptional({ example: 'Maria' })
  @IsOptional()
  @IsString()
  name?: string;
}
