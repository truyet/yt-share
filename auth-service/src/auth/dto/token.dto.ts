import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  expires_in: number;
}
