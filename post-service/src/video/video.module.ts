import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { VideoService } from './video.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: VideoService,
      useClass: YoutubeService,
    },
  ],
})
export class VideoModule {}
