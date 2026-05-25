import { UsersService } from './users.service';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    getById(id: string): Promise<{
        email: string;
        nickname: string;
        id: string;
        avatar: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        _count: {
            favorites: number;
        };
    }>;
}
