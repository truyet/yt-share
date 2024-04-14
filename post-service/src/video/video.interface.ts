export interface VideoThumbnail {
  url: string;
  width: string;
  height: string;
}

export interface VideoThumbnails {
  default: VideoThumbnail;
  medium: VideoThumbnail;
  high: VideoThumbnail;
}

export interface VideoDetail {
  id: string;
  title: string;
  description: string;
  thumbnails: VideoThumbnail;
}
