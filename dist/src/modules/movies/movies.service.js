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
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let MoviesService = class MoviesService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async searchTMDB(query) {
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
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=zh-CN`);
        const data = await res.json();
        return (data.results || []).map((m) => ({
            tmdbId: m.id,
            title: m.title,
            titleZh: m.original_title !== m.title ? m.original_title : undefined,
            year: m.release_date ? new Date(m.release_date).getFullYear() : null,
            posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null,
            overview: m.overview,
        }));
    }
    async findOne(id) {
        const movie = await this.prisma.movie.findUnique({ where: { id } });
        if (!movie)
            throw new common_1.NotFoundException('电影不存在');
        return movie;
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map