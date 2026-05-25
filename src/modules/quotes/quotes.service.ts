import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuoteDto, QueryQuoteDto, SubmitTranslationDto } from './quotes.dto';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryQuoteDto) {
    const { tag, search, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'APPROVED',
      ...(tag && { tags: { some: { name: tag } } }),
      ...(search && {
        OR: [
          { content: { contains: search, mode: 'insensitive' } },
          { movie: { title: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [quotes, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          movie: { select: { id: true, title: true, titleZh: true, director: true, year: true, posterUrl: true } },
          tags: { select: { name: true } },
          translations: { where: { status: 'APPROVED' }, select: { language: true, content: true } },
        },
      }),
      this.prisma.quote.count({ where }),
    ]);

    const items = quotes.map((q) => ({
      ...q,
      tags: q.tags.map((t: any) => t.name),
    }));

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: {
        movie: { select: { id: true, title: true, titleZh: true, director: true, year: true, posterUrl: true } },
        tags: { select: { name: true } },
        translations: { where: { status: 'APPROVED' }, include: { translator: { select: { nickname: true } } } },
      },
    });
    if (!quote) throw new NotFoundException('台词不存在');
    await this.prisma.quote.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    return {
      ...quote,
      tags: quote.tags.map((t: any) => t.name),
      favoriteCount: 0,
    };
  }

  async random(mood?: string) {
    const where: any = { status: 'APPROVED' };
    const count = await this.prisma.quote.count({ where });
    if (count === 0) throw new NotFoundException('没有找到符合条件的台词');
    const skip = Math.floor(Math.random() * count);
    const quote = await this.prisma.quote.findFirst({
      where,
      skip,
      include: {
        movie: { select: { id: true, title: true, titleZh: true, director: true, year: true, posterUrl: true } },
        tags: { select: { name: true } },
        translations: { where: { status: 'APPROVED' } },
      },
    });
    return quote ? { ...quote, tags: quote.tags.map((t: any) => t.name) } : null;
  }

  async create(dto: CreateQuoteDto, userId: string) {
    return this.prisma.quote.create({
      data: {
        content: dto.content,
        movieId: dto.movieId,
        submitterId: userId,
        status: 'PENDING',
      },
      include: { movie: true },
    });
  }

  async submitTranslation(dto: SubmitTranslationDto, userId: string) {
    return this.prisma.quoteTranslation.create({
      data: {
        quoteId: dto.quoteId,
        translatorId: userId,
        language: dto.language,
        content: dto.content,
        authority: 'USER',
        status: 'PENDING',
      },
    });
  }

  async getTags() {
    const tags = await this.prisma.quoteTag.findMany({
      take: 50,
      select: { name: true },
    });
    return tags.map((t) => ({ name: t.name, count: 0 }));
  }
}
