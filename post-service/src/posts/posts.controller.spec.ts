import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { VideoModule } from '../video/video.module';
import { HttpModule } from '@nestjs/axios';
import { YoutubeService } from '../video/youtube.service';

describe('PostsController', () => {
  let controller: PostsController;
  let prisma: PrismaService;
  let postSvc: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, PrismaModule, VideoModule],
      controllers: [PostsController],
      providers: [PostsService, YoutubeService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    prisma = module.get<PrismaService>(PrismaService);
    postSvc = module.get<PostsService>(PostsService);
  });

  it('create', async () => {
    const posts = [];
    prisma.post.create = jest.fn().mockImplementationOnce(({ data }) => {
      posts.push(data);
      return data;
    }); //.mockReturnValueOnce();

    postSvc.sendNotificationNewPost = jest.fn().mockResolvedValue({});

    const videoUrl = 'https://www.youtube.com/watch?v=STKCRSUsyP0';
    const post = await controller.create({ user: { sub: 1 } }, { videoUrl });
    expect(post.videoUrl).toEqual(videoUrl);
    expect(post.authorId).toEqual(1);
  });

  it('findLatest', async () => {
    const posts = [
      { id: 1, title: 'Post 1', description: 'Desc 1' },
      { id: 2, title: 'Post 2', description: 'Desc 2' },
      { id: 3, title: 'Post 3', description: 'Desc 3' },
      { id: 4, title: 'Post 4', description: 'Desc 4' },
      { id: 5, title: 'Post 5', description: 'Desc 5' },
      { id: 6, title: 'Post 6', description: 'Desc 6' },
      { id: 7, title: 'Post 7', description: 'Desc 7' },
      { id: 8, title: 'Post 8', description: 'Desc 8' },
      { id: 9, title: 'Post 9', description: 'Desc 9' },
      { id: 10, title: 'Post 10', description: 'Desc 10' },
    ];

    prisma.post.findMany = jest
      .fn()
      .mockImplementationOnce(({ take, where }) => {
        let data = posts.sort((a, b) => {
          if (a.id < b.id) return 1;
          if (a.id > b.id) return -1;
        });
        if (where.id) {
          data = data.filter((it) => it.id < where.id.lt);
        }

        data = data.slice(0, take);

        return data;
      }); //.mockReturnValueOnce();

    const postsResp = await controller.findLatest({ user: { id: 1 } }, '');
    expect(postsResp[0].id).toEqual(10);
  });
  it('findLatest_WithNext', async () => {
    const posts = [
      { id: 1, title: 'Post 1', description: 'Desc 1' },
      { id: 2, title: 'Post 2', description: 'Desc 2' },
      { id: 3, title: 'Post 3', description: 'Desc 3' },
      { id: 4, title: 'Post 4', description: 'Desc 4' },
      { id: 5, title: 'Post 5', description: 'Desc 5' },
      { id: 6, title: 'Post 6', description: 'Desc 6' },
      { id: 7, title: 'Post 7', description: 'Desc 7' },
      { id: 8, title: 'Post 8', description: 'Desc 8' },
      { id: 9, title: 'Post 9', description: 'Desc 9' },
      { id: 10, title: 'Post 10', description: 'Desc 10' },
    ];

    prisma.post.findMany = jest
      .fn()
      .mockImplementationOnce(({ take, where }) => {
        let data = posts.sort((a, b) => {
          if (a.id < b.id) return 1;
          if (a.id > b.id) return -1;
        });
        if (where.id) {
          data = data.filter((it) => it.id < where.id.lt);
        }

        data = data.slice(0, take);

        return data;
      }); //.mockReturnValueOnce();

    const postsResp = await controller.findLatest({ user: { sub: 1 } }, '5');
    expect(postsResp[0].id).toEqual(4);
  });

  it('interactLike', async () => {
    const posts = [
      {
        id: 1,
        title: 'Post 1',
        description: 'Desc 1',
        likeCount: 0,
        dislikeCount: 0,
      },
    ];
    const postInteractions = [];

    prisma.post.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return posts[0];
    });

    prisma.postInteraction.findFirst = jest.fn().mockImplementationOnce(() => {
      return null;
    });

    prisma.postInteraction.create = jest
      .fn()
      .mockImplementationOnce(({ data }) => {
        postInteractions.push(data);
        return data;
      });

    prisma.post.update = jest.fn().mockImplementationOnce(({ where, data }) => {
      const p = posts.find((it) => it.id === where.id);
      p.likeCount = p.likeCount + data.likeCount.increment;
      return p;
    });
    prisma.$transaction = jest
      .fn()
      .mockImplementation((callback) => callback(prisma));

    const postResp = await controller.interact({ user: { sub: 1 } }, '1', {
      type: 'LIKE',
    });
    expect(postResp.likeCount).toEqual(1);
    expect(postInteractions[0].userId).toEqual(1);
    expect(postInteractions[0].type).toEqual('LIKE');
  });

  it('interactDislike', async () => {
    const posts = [
      {
        id: 1,
        title: 'Post 1',
        description: 'Desc 1',
        likeCount: 0,
        dislikeCount: 0,
      },
    ];
    const postInteractions = [];

    prisma.post.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return posts[0];
    });

    prisma.postInteraction.findFirst = jest.fn().mockImplementationOnce(() => {
      return null;
    });

    prisma.postInteraction.create = jest
      .fn()
      .mockImplementationOnce(({ data }) => {
        postInteractions.push(data);
        return data;
      });

    prisma.post.update = jest.fn().mockImplementationOnce(({ where, data }) => {
      const p = posts.find((it) => it.id === where.id);
      p.dislikeCount = p.dislikeCount + data.dislikeCount.increment;
      return p;
    });
    prisma.$transaction = jest
      .fn()
      .mockImplementation((callback) => callback(prisma));

    const postResp = await controller.interact({ user: { sub: 1 } }, '1', {
      type: 'DISLIKE',
    });
    expect(postResp.dislikeCount).toEqual(1);
    expect(postInteractions[0].userId).toEqual(1);
    expect(postInteractions[0].type).toEqual('DISLIKE');
  });

  it('interactUnlike', async () => {
    const posts = [
      {
        id: 1,
        title: 'Post 1',
        description: 'Desc 1',
        likeCount: 1,
        dislikeCount: 1,
      },
    ];
    let postInteractions = [{ id: 1, userId: 1, videoId: 1, type: 'LIKE' }];

    prisma.post.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return posts[0];
    });

    prisma.postInteraction.findFirst = jest
      .fn()
      .mockImplementationOnce(({ where }) => {
        return postInteractions[0];
      });

    prisma.post.update = jest.fn().mockImplementationOnce(({ where, data }) => {
      const p = posts.find((it) => it.id === where.id);
      p.likeCount = p.likeCount - data.likeCount.decrement;
      return p;
    });

    prisma.postInteraction.delete = jest
      .fn()
      .mockImplementationOnce(({ where }) => {
        postInteractions = postInteractions.filter((it) => it.id !== where.id);
      });

    prisma.$transaction = jest
      .fn()
      .mockImplementation((callback) => callback(prisma));

    const postResp = await controller.interact({ user: { sub: 1 } }, '1', {
      type: 'LIKE',
    });
    expect(postResp.likeCount).toEqual(0);
    expect(postInteractions.length).toEqual(0);
  });

  it('interactUndislike', async () => {
    const posts = [
      {
        id: 1,
        title: 'Post 1',
        description: 'Desc 1',
        likeCount: 1,
        dislikeCount: 1,
      },
    ];
    let postInteractions = [{ id: 1, userId: 1, videoId: 1, type: 'DISLIKE' }];

    prisma.post.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return posts[0];
    });

    prisma.postInteraction.findFirst = jest
      .fn()
      .mockImplementationOnce(({ where }) => {
        return postInteractions[0];
      });

    prisma.post.update = jest.fn().mockImplementationOnce(({ where, data }) => {
      const p = posts.find((it) => it.id === where.id);
      p.dislikeCount = p.dislikeCount - data.dislikeCount.decrement;
      return p;
    });

    prisma.postInteraction.delete = jest
      .fn()
      .mockImplementationOnce(({ where }) => {
        postInteractions = postInteractions.filter((it) => it.id !== where.id);
      });

    prisma.$transaction = jest
      .fn()
      .mockImplementation((callback) => callback(prisma));

    const postResp = await controller.interact({ user: { sub: 1 } }, '1', {
      type: 'DISLIKE',
    });
    expect(postResp.dislikeCount).toEqual(0);
    expect(postInteractions.length).toEqual(0);
  });
});
