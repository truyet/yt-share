import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserEnt } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsersByIds(ids: number[]): Promise<UserEnt[]> {
    return this.prisma.user.findMany({
      select: { id: true, email: true, name: true },
      where: { id: { in: ids } },
    });
  }

  async getUser(email: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
