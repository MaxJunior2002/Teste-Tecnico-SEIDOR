import { ApiProperty } from '@nestjs/swagger';

export class Car {
  @ApiProperty({
    format: 'uuid',
    example: 'd9428888-122b-11e1-b85c-61cd3cbb3210',
  })
  id: string;

  @ApiProperty({ example: 'ABC-1234' })
  plate: string;

  @ApiProperty({ example: 'Blue' })
  color: string;

  @ApiProperty({ example: 'Honda' })
  brand: string;

  constructor(id: string, plate: string, color: string, brand: string) {
    this.id = id;
    this.plate = plate;
    this.color = color;
    this.brand = brand;
  }
}
