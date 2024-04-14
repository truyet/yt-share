import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('getUsersByIds', async () => {
    const data = [
      { id: 1, name: 'user 1', email: 'user1@gmail.com' },
      { id: 2, name: 'user 2', email: 'user2@gmail.com' },
      { id: 3, name: 'user 3', email: 'user3@gmail.com' },
      { id: 4, name: 'user 4', email: 'user4@gmail.com' },
    ];
    prisma.user.findMany = jest.fn().mockImplementationOnce(({ where }) => {
      return data.filter((it) => where.id.in.includes(it.id));
    }); //.mockReturnValueOnce();
    const ids = [1, 2, 3];
    const users = await service.getUsersByIds([1, 2, 3]);
    expect(users.length).toEqual(ids.length);
  });

  it('getUser', async () => {
    const data = [
      { id: 1, name: 'user 1', email: 'user1@gmail.com' },
      { id: 2, name: 'user 2', email: 'user2@gmail.com' },
      { id: 3, name: 'user 3', email: 'user3@gmail.com' },
      { id: 4, name: 'user 4', email: 'user4@gmail.com' },
    ];
    prisma.user.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return data.find((it) => where.email === it.email);
    }); //.mockReturnValueOnce();
    const user = await service.getUser('user1@gmail.com');
    expect(user).toBeDefined();
  });

  it('createUser', async () => {
    const users = [];
    prisma.user.create = jest.fn().mockImplementationOnce(({ data }) => {
      users.push(data);
      return data;
    }); //.mockReturnValueOnce();
    const user = await service.createUser({
      name: 'user 1',
      email: 'user1@gmail.com',
      password: '',
      salt: '',
    });
    expect(user.email).toEqual(users[0].email);
  });
});
