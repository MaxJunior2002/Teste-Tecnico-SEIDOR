import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  @IsNotEmpty()
  plate!: string;

  @ApiProperty({ example: 'Blue' })
  @IsString()
  @IsNotEmpty()
  color!: string;

  @ApiProperty({ example: 'Honda' })
  @IsString()
  @IsNotEmpty()
  brand!: string;
}
