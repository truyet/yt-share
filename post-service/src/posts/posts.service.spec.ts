import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { VideoModule } from '../video/video.module';
import { YoutubeService } from '../video/youtube.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, PrismaModule, VideoModule],
      providers: [PostsService, YoutubeService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('Initial', () => {
    expect(service).toBeDefined();
  });
});
