import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { LatestPostDto } from './dto/find-post.dto';
import { PostEnt } from './entities/post.entity';
import { YoutubeService } from '../video/youtube.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private videoService: YoutubeService,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    authorId: number,
  ): Promise<PostEnt> {
    const video = await this.videoService.getVideoInfo(createPostDto.videoUrl);
    if (!video) {
      throw new NotFoundException('INVALID_URL');
    }

    const data: Prisma.PostCreateInput = {
      title: video.title,
      description: video.description,
      thumbnails: JSON.stringify(video.thumbnails),
      authorId: authorId,
      videoId: video.id,
      videoUrl: createPostDto.videoUrl,
    };
    const post = await this.prisma.post.create({ data });
    this.sendNotificationNewPost(post);
    return post;
  }

  async getLatest(
    latestPostDto: LatestPostDto,
    userId: number,
  ): Promise<PostEnt[]> {
    let where = {};
    if (latestPostDto.next) {
      where = { id: { lt: latestPostDto.next } };
    }
    const posts = await this.prisma.post.findMany({
      take: latestPostDto.limit,
      where,
      orderBy: {
        id: 'desc',
      },
    });

    const postEnts: PostEnt[] = posts.map((it) => {
      return { ...it };
    });
    if (postEnts.length > 0 && userId) {
      const postIds = posts.map((p) => p.id);
      // Logger.log(postIds, userId);
      const interactions = await this.prisma.postInteraction
        .findMany({
          where: { videoId: { in: postIds }, userId },
        })
      const uints = new Map(interactions.map((it) => [it.videoId, it.type]));
      // Logger.log(Array.from(interactions.keys()));
      postEnts.forEach((it) => {
        it.userInteraction = uints.get(it.id);
      });
    }
    return postEnts;
  }

  findOne(id: number): Promise<PostEnt> {
    const where = { id };
    return this.prisma.post.findUnique({
      where,
    });
  }

  interact(videoId: number, userId: number, type: string): Promise<PostEnt> {
    return this.prisma.$transaction(async (tx) => {
      let post = await tx.post.findFirst({ where: { id: videoId } });
      if (!post) {
        return null;
      }
      const where: Prisma.PostInteractionWhereInput = { userId, videoId };
      let item = await tx.postInteraction.findFirst({ where });
      let data = {};
      // Logger.log('item', item);
      if (!item) {
        item = await tx.postInteraction.create({
          data: { userId, videoId, type },
        });
        // Logger.log('item', item);
        if (type === 'LIKE') {
          data = {
            likeCount: { increment: 1 },
          };
        }
        if (type === 'DISLIKE') {
          data = {
            dislikeCount: { increment: 1 },
          };
        }
      } else {
        if (type === item.type) {
          await tx.postInteraction.delete({ where: { id: item.id } });
          if (type === 'LIKE') {
            data = {
              likeCount: { decrement: 1 },
            };
          }
          if (type === 'DISLIKE') {
            data = {
              dislikeCount: { decrement: 1 },
            };
          }
        }
      }
      post = await tx.post.update({
        where: { id: videoId },
        data,
      });
      return { ...post, userInteraction: type };
    });
  }

  async sendNotificationNewPost(post: any) {
    await await firstValueFrom(
      this.httpService
        .post('http://realtime-server:3000/realtime/share', post)
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error?.response?.data);
            throw 'An error happened!';
          }),
        ),
    );
  }
}
