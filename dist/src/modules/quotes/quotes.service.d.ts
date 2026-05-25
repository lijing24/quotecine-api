import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuoteDto, QueryQuoteDto, SubmitTranslationDto } from './quotes.dto';
export declare class QuotesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryQuoteDto): Promise<{
        items: {
            tags: any[];
            movie: {
                id: string;
                year: number;
                title: string;
                titleZh: string;
                director: string;
                posterUrl: string;
            };
            translations: {
                content: string;
                language: string;
            }[];
            id: string;
            status: import(".prisma/client").$Enums.QuoteStatus;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            movieId: string;
            submitterId: string | null;
            favoriteCount: number;
            viewCount: number;
            isPinned: boolean;
            rejectionReason: string | null;
            approvedAt: Date | null;
        }[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<{
        tags: any[];
        favoriteCount: number;
        movie: {
            id: string;
            year: number;
            title: string;
            titleZh: string;
            director: string;
            posterUrl: string;
        };
        translations: ({
            translator: {
                nickname: string;
            };
        } & {
            id: string;
            status: import(".prisma/client").$Enums.TranslationStatus;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            quoteId: string;
            language: string;
            translatorId: string | null;
            authority: import(".prisma/client").$Enums.TranslationAuthority;
            upvoteCount: number;
        })[];
        id: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        movieId: string;
        submitterId: string | null;
        viewCount: number;
        isPinned: boolean;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    random(mood?: string): Promise<{
        tags: any[];
        movie: {
            id: string;
            year: number;
            title: string;
            titleZh: string;
            director: string;
            posterUrl: string;
        };
        translations: {
            id: string;
            status: import(".prisma/client").$Enums.TranslationStatus;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            quoteId: string;
            language: string;
            translatorId: string | null;
            authority: import(".prisma/client").$Enums.TranslationAuthority;
            upvoteCount: number;
        }[];
        id: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        movieId: string;
        submitterId: string | null;
        favoriteCount: number;
        viewCount: number;
        isPinned: boolean;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    create(dto: CreateQuoteDto, userId: string): Promise<{
        movie: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            year: number;
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
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.QuoteStatus;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        movieId: string;
        submitterId: string | null;
        favoriteCount: number;
        viewCount: number;
        isPinned: boolean;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    submitTranslation(dto: SubmitTranslationDto, userId: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.TranslationStatus;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        quoteId: string;
        language: string;
        translatorId: string | null;
        authority: import(".prisma/client").$Enums.TranslationAuthority;
        upvoteCount: number;
    }>;
    getTags(): Promise<{
        name: string;
        count: number;
    }[]>;
}
