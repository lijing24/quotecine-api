import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        avatar: true,
        role: true,
        createdAt: true,
        _count: { select: { favorites: true } },
      },
    });
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }
}
