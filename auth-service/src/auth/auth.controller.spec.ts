import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('registerSuccess', async () => {
    const users = [];
    
    prisma.user.create = jest.fn().mockImplementationOnce(({ data }) => {
      users.push(data);
      return data;
    });

    prisma.user.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return users.find((it) => it.email === where.email);
    });

    const regResp = await authController.register({
      name: '',
      email: 'user1@gmail.com',
      password: '123456',
    });
    expect(regResp.access_token?.length).toBeGreaterThan(0);
    expect(regResp.expires_in).toEqual(3600);
  });

  it('registerEmailExisted', async () => {
    const users = [
      { id: 1, name: 'user 1', email: 'user1@gmail.com' },
    ];

    prisma.user.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return users.find((it) => where.email === it.email);
    });

    expect(async () => {
      await authController.register({
        name: '',
        email: 'user1@gmail.com',
        password: '123456',
      });
    }).rejects.toThrow(BadRequestException);
  });


  it('loginSuccess', async () => {
    const users = [];
    
    users.push({
      email: 'user1@gmail.com',
      name: '',
      password: '$argon2id$v=19$m=65536,t=3,p=4$ZJcBSgXTVyozyPB6d3wE0g$KkqiOibHaShmmq+6I3aQBGQWs0wpOYLP04fBHjEZbLE',
      salt: '2aeb2992508a75e6'
    })
    prisma.user.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      console.log('users', users)
      return users.find((it) => it.email === where.email);
    });

    const signInResp = await authController.signIn({
      email: 'user1@gmail.com',
      password: '123456',
    });
    expect(signInResp.access_token?.length).toBeGreaterThan(0);
    expect(signInResp.expires_in).toEqual(3600);
  });

  it('loginFailWithWrongPass', async () => {
    const users = [];
    prisma.user.create = jest.fn().mockImplementationOnce(({ data }) => {
      users.push(data);
      return data;
    });

    // password 123456
    users.push({
      email: 'user1@gmail.com',
      name: '',
      password: '$argon2id$v=19$m=65536,t=3,p=4$ZJcBSgXTVyozyPB6d3wE0g$KkqiOibHaShmmq+6I3aQBGQWs0wpOYLP04fBHjEZbLE',
      salt: '2aeb2992508a75e6'
    })
    prisma.user.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return users.find((it) => where.email === it.email);
    });
    
    expect(async () => {
      await authController.signIn({
        email: 'user1@gmail.com',
        password: '1234567',
      });
    }).rejects.toThrow(UnauthorizedException);
  });

  it('registerAndProfileSuccess', async () => {
    const users = [];
    prisma.user.create = jest.fn().mockImplementationOnce(({ data }) => {
      users.push(data);
      return data;
    });

    prisma.user.findFirst = jest.fn().mockImplementationOnce(({ where }) => {
      return users.find((it) => where.email === it.email);
    });

    const regResp = await authController.register({
      name: '',
      email: 'user1@gmail.com',
      password: '123456',
    });
    expect(regResp.access_token?.length).toBeGreaterThan(0);
    expect(regResp.expires_in).toEqual(3600);
  });
});
