import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class MoviesService {
    private prisma;
    private config;
    constructor(prisma: PrismaService, config: ConfigService);
    searchTMDB(query: string): Promise<any>;
    findOne(id: string): Promise<{
        year: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tmdbId: number | null;
        title: string;
        titleZh: string | null;
        director: string;
        posterUrl: string | null;
        backdropUrl: string | null;
        overview: string | null;
        genres: string[];
        runtime: number | null;
        tmdbVoteAvg: number | null;
    }>;
}
