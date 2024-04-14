import { ApiProperty } from '@nestjs/swagger';

export class UserIdsDto {
  @ApiProperty()
  ids: number[];
}

export class UserEnt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}
