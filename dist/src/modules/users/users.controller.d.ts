import { UsersService } from './users.service';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    getById(id: string): Promise<{
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
