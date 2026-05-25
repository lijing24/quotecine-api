import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MoviesService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async searchTMDB(query: string) {
    const apiKey = this.config.get('TMDB_API_KEY');
    if (!apiKey) {
      return this.prisma.movie.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { titleZh: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 10,
        select: { id: true, title: true, titleZh: true, year: true, posterUrl: true, director: true },
      });
    }
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=zh-CN`,
    );
    const data = await res.json();
    return (data.results || []).map((m: any) => ({
      tmdbId: m.id,
      title: m.title,
      titleZh: m.original_title !== m.title ? m.original_title : undefined,
      year: m.release_date ? new Date(m.release_date).getFullYear() : null,
      posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null,
      overview: m.overview,
    }));
  }

  async findOne(id: string) {
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException('电影不存在');
    return movie;
  }
}
