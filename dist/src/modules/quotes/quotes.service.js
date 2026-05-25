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
exports.QuotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let QuotesService = class QuotesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { tag, search, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const where = {
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
            tags: q.tags.map((t) => t.name),
        }));
        return { items, total, page, limit, pages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const quote = await this.prisma.quote.findUnique({
            where: { id },
            include: {
                movie: { select: { id: true, title: true, titleZh: true, director: true, year: true, posterUrl: true } },
                tags: { select: { name: true } },
                translations: { where: { status: 'APPROVED' }, include: { translator: { select: { nickname: true } } } },
            },
        });
        if (!quote)
            throw new common_1.NotFoundException('台词不存在');
        await this.prisma.quote.update({ where: { id }, data: { viewCount: { increment: 1 } } });
        return {
            ...quote,
            tags: quote.tags.map((t) => t.name),
            favoriteCount: 0,
        };
    }
    async random(mood) {
        const where = { status: 'APPROVED' };
        const count = await this.prisma.quote.count({ where });
        if (count === 0)
            throw new common_1.NotFoundException('没有找到符合条件的台词');
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
        return quote ? { ...quote, tags: quote.tags.map((t) => t.name) } : null;
    }
    async create(dto, userId) {
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
    async submitTranslation(dto, userId) {
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
};
exports.QuotesService = QuotesService;
exports.QuotesService = QuotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotesService);
//# sourceMappingURL=quotes.service.js.map