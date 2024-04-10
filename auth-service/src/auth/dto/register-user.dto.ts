import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly password: string;
}
