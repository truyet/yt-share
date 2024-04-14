import { Body, Controller, Logger, Post } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserEnt, UserIdsDto } from './dto/users.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UsersService) {}

  @Public()
  @ApiOperation({ summary: 'Get Users' })
  @Post('/ids')
  async getProfile(@Body() dto: UserIdsDto): Promise<UserEnt[]> {
    const users = await this.userService.getUsersByIds(dto.ids);
    return users;
  }
}
