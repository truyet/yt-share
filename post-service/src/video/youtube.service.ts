import { Injectable, Logger } from '@nestjs/common';
import { VideoDetail } from './video.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { VideoService } from './video.service';

@Injectable()
export class YoutubeService extends VideoService {
  private readonly logger = new Logger(YoutubeService.name);
  private dataUrl: string = 'https://www.googleapis.com/youtube/v3/videos';
  private apiKey: string = 'AIzaSyAC_qaNbsgyR2O80zArqWMyxDNeX9u5hpo';

  constructor(private readonly httpService: HttpService) {
    super();
  }

  async getVideoInfo(url: string): Promise<VideoDetail> {
    const urlParams = new URL(url);
    const id = urlParams.searchParams.get('v');
    Logger.log(url);
    const resp = await firstValueFrom(
      this.httpService
        .get(`${this.dataUrl}?part=id&part=snippet&id=${id}&key=${this.apiKey}`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    const videoItem = resp.data?.items[0];
    if (!videoItem) {
      return null;
    }
    return {
      id: videoItem.id,
      description: videoItem.snippet?.description,
      title: videoItem.snippet?.title,
      thumbnails: videoItem.snippet?.thumbnails,
    };
  }
}
