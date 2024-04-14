import { ApiProperty } from '@nestjs/swagger';

export class LatestPostDto {
  @ApiProperty()
  next: number;
  @ApiProperty()
  limit: number;
}
