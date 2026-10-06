import { ApiProperty } from '@nestjs/swagger';

export class Driver {
  @ApiProperty({
    format: 'uuid',
    example: 'd9428888-122b-11e1-b85c-61cd3cbb3210',
  })
  id: string;

  @ApiProperty({ example: 'Maria Silva' })
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
