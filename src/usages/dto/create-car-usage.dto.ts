import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCarUsageDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  driverId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  carId!: string;

  @ApiProperty({ example: 'Visit to a customer site' })
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
