import { ApiProperty } from '@nestjs/swagger';

export class PostEnt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  thumbnails: string;

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  dislikeCount: number;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userInteraction?: string;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  videoId: string;
}
