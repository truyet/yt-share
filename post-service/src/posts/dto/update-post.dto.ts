import { ApiProperty } from '@nestjs/swagger';

export class InteractionPostDto {
  @ApiProperty()
  type: string;
}
