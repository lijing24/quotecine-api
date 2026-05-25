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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('邮箱已被注册');
        const hash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: { email: dto.email, nickname: dto.nickname, passwordHash: hash },
            select: { id: true, email: true, nickname: true, role: true },
        });
        await this.prisma.collection.create({
            data: { name: '我的收藏', userId: user.id, isDefault: true, isPublic: true },
        });
        const tokens = await this.generateTokens(user.id);
        return { user, ...tokens };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('邮箱或密码错误');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const tokens = await this.generateTokens(user.id);
        return {
            user: { id: user.id, email: user.email, nickname: user.nickname, role: user.role },
            ...tokens,
        };
    }
    async refreshTokens(refreshToken) {
        const record = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!record || record.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token 无效或已过期');
        }
        await this.prisma.refreshToken.delete({ where: { id: record.id } });
        return this.generateTokens(record.userId);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, nickname: true, avatar: true, role: true, createdAt: true, lastLoginAt: true },
        });
        if (!user)
            throw new common_1.UnauthorizedException('用户不存在');
        return user;
    }
    async generateTokens(userId) {
        const payload = { sub: userId };
        const accessToken = this.jwt.sign(payload);
        const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.prisma.refreshToken.create({ data: { token: refreshToken, userId, expiresAt } });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map