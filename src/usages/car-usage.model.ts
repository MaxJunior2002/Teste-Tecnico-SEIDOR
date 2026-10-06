import { ApiProperty } from '@nestjs/swagger';
import { Car } from '../cars/car.model.js';
import { Driver } from '../drivers/driver.model.js';

export class CarUsage {
  @ApiProperty({
    format: 'uuid',
    example: 'd9428888-122b-11e1-b85c-61cd3cbb3210',
  })
  id: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-10-06T12:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({ example: 'Visit a customer' })
  reason: string;

  @ApiProperty({ type: () => Driver })
  driver: Driver;

  @ApiProperty({ type: () => Car })
  car: Car;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: null,
  })
  endDate: Date | null;

  constructor(
    id: string,
    startDate: Date,
    reason: string,
    driver: Driver,
    car: Car,
    endDate: Date | null = null,
  ) {
    this.id = id;
    this.startDate = startDate;
    this.reason = reason;
    this.driver = driver;
    this.car = car;
    this.endDate = endDate;
  }
}
