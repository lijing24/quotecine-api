import { PrismaService } from '../../prisma/prisma.service';
export declare class CollectionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserCollections(userId: string): Promise<any>;
    addToCollection(userId: string, collectionId: string, quoteId: string): Promise<any>;
    removeFromCollection(userId: string, collectionId: string, quoteId: string): Promise<any>;
    createCollection(userId: string, name: string, description?: string): Promise<any>;
    getFavorites(userId: string): Promise<any>;
    toggleFavorite(userId: string, quoteId: string): Promise<{
        favorited: boolean;
    }>;
}
