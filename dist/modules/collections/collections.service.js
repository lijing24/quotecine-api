"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CollectionsService = class CollectionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserCollections(userId) {
        return this.prisma.collection.findMany({
            where: { userId },
            include: {
                _count: { select: { items: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async addToCollection(userId, collectionId, quoteId) {
        const col = await this.prisma.collection.findUnique({ where: { id: collectionId } });
        if (!col || col.userId !== userId)
            throw new Error('收藏夹不存在');
        return this.prisma.collectionItem.upsert({
            where: { collectionId_quoteId: { collectionId, quoteId } },
            update: {},
            create: { collectionId, quoteId },
        });
    }
    async removeFromCollection(userId, collectionId, quoteId) {
        const col = await this.prisma.collection.findUnique({ where: { id: collectionId } });
        if (!col || col.userId !== userId)
            throw new Error('收藏夹不存在');
        return this.prisma.collectionItem.deleteMany({
            where: { collectionId, quoteId },
        });
    }
    async createCollection(userId, name, description) {
        return this.prisma.collection.create({
            data: { name, userId, description, isDefault: false, isPublic: true },
        });
    }
    async getFavorites(userId) {
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
    async toggleFavorite(userId, quoteId) {
        const existing = await this.prisma.favorite.findUnique({
            where: { userId_quoteId: { userId, quoteId } },
        });
        if (existing) {
            await this.prisma.favorite.delete({ where: { id: existing.id } });
            await this.prisma.quote.update({ where: { id: quoteId }, data: { favoriteCount: { decrement: 1 } } });
            return { favorited: false };
        }
        else {
            await this.prisma.favorite.create({ data: { userId, quoteId } });
            await this.prisma.quote.update({ where: { id: quoteId }, data: { favoriteCount: { increment: 1 } } });
            return { favorited: true };
        }
    }
};
exports.CollectionsService = CollectionsService;
exports.CollectionsService = CollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CollectionsService);
//# sourceMappingURL=collections.service.js.map