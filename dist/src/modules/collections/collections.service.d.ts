import { PrismaService } from '../../prisma/prisma.service';
export declare class CollectionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserCollections(userId: string): Promise<({
        _count: {
            items: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        coverUrl: string | null;
        isDefault: boolean;
        isPublic: boolean;
        slug: string | null;
        userId: string;
    })[]>;
    addToCollection(userId: string, collectionId: string, quoteId: string): Promise<{
        id: string;
        createdAt: Date;
        quoteId: string;
        collectionId: string;
        note: string | null;
    }>;
    removeFromCollection(userId: string, collectionId: string, quoteId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    createCollection(userId: string, name: string, description?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        coverUrl: string | null;
        isDefault: boolean;
        isPublic: boolean;
        slug: string | null;
        userId: string;
    }>;
    getFavorites(userId: string): Promise<({
        quote: {
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
            tags: {
                name: string;
            }[];
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        quoteId: string;
    })[]>;
    toggleFavorite(userId: string, quoteId: string): Promise<{
        favorited: boolean;
    }>;
}
