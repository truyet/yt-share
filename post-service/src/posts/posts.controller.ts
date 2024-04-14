import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { InteractionPostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { PostEnt } from './entities/post.entity';

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create new post' })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  @ApiOkResponse({ description: 'Success', type: PostEnt })
  @Post()
  async create(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEnt> {
    return this.postsService.create(createPostDto, Number(req.user.sub));
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get posts latest' })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  @ApiQuery({ name: 'next', required: false, type: Number })
  @ApiOkResponse({ description: 'Success', type: PostEnt, isArray: true })
  @Get('/latest')
  async findLatest(
    @Request() req,
    @Query('next') next?: string,
  ): Promise<PostEnt[]> {
    return this.postsService.getLatest(
      { next: Number(next), limit: 50 },
      Number(req.user?.sub),
    );
  }

  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get Post detail' })
  // @ApiResponse({ status: 401, description: 'Unauthorize' })
  // @ApiOkResponse({ description: 'Success', type: PostEnt })
  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<PostEnt> {
  //   return this.postsService.findOne(Number(id));
  // }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like / Dislike Post' })
  @ApiResponse({ status: 401, description: 'Unauthorize' })
  @ApiOkResponse({ description: 'Success', type: PostEnt })
  @Put('/:id/interact')
  async interact(
    @Request() req,
    @Param('id') id: string,
    @Body() interactionPostDto: InteractionPostDto,
  ): Promise<PostEnt> {
    return this.postsService.interact(
      Number(id),
      Number(req.user?.sub),
      interactionPostDto.type,
    );
  }
}
