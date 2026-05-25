import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async getUserCollections(userId: string) {
    return this.prisma.collection.findMany({
      where: { userId },
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async addToCollection(userId: string, collectionId: string, quoteId: string) {
    const col = await this.prisma.collection.findUnique({ where: { id: collectionId } });
    if (!col || col.userId !== userId) throw new Error('收藏夹不存在');
    return this.prisma.collectionItem.upsert({
      where: { collectionId_quoteId: { collectionId, quoteId } },
      update: {},
      create: { collectionId, quoteId },
    });
  }

  async removeFromCollection(userId: string, collectionId: string, quoteId: string) {
    const col = await this.prisma.collection.findUnique({ where: { id: collectionId } });
    if (!col || col.userId !== userId) throw new Error('收藏夹不存在');
    return this.prisma.collectionItem.deleteMany({
      where: { collectionId, quoteId },
    });
  }

  async createCollection(userId: string, name: string, description?: string) {
    return this.prisma.collection.create({
      data: { name, userId, description, isDefault: false, isPublic: true },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        quote: {
          include: {
            movie: { select: { id: true, title: true, titleZh: true, posterUrl: true, year: true, director: true } },
            tags: { select: { name: true } },
            translations: { where: { status: 'APPROVED' } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleFavorite(userId: string, quoteId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_quoteId: { userId, quoteId } },
    });
    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      await this.prisma.quote.update({ where: { id: quoteId }, data: { favoriteCount: { decrement: 1 } } });
      return { favorited: false };
    } else {
      await this.prisma.favorite.create({ data: { userId, quoteId } });
      await this.prisma.quote.update({ where: { id: quoteId }, data: { favoriteCount: { increment: 1 } } });
      return { favorited: true };
    }
  }
}
