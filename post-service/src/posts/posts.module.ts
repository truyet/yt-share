import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VideoModule } from 'src/video/video.module';
import { YoutubeService } from 'src/video/youtube.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, PrismaModule, VideoModule],
  controllers: [PostsController],
  providers: [PostsService, YoutubeService],
})
export class PostsModule {}
