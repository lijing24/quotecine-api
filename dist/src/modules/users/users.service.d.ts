import { PrismaService } from '../../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(id: string): Promise<{
        id: string;
        email: string;
        nickname: string;
        avatar: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        _count: {
            favorites: number;
        };
    }>;
}
