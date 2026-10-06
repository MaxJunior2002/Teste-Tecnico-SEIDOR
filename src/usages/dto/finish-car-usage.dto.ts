import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FinishCarUsageDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  carId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  driverId!: string;
}
