import { CollectionsService } from './collections.service';
export declare class CollectionsController {
    private collections;
    constructor(collections: CollectionsService);
    getMyCollections(userId: string): Promise<any>;
    getMyFavorites(userId: string): Promise<any>;
    toggleFavorite(userId: string, quoteId: string): Promise<{
        favorited: boolean;
    }>;
    createCollection(userId: string, body: {
        name: string;
        description?: string;
    }): Promise<any>;
    addItem(userId: string, collectionId: string, quoteId: string): Promise<any>;
    removeItem(userId: string, collectionId: string, quoteId: string): Promise<any>;
}
