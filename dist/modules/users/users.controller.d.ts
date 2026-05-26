import { UsersService } from './users.service';
export declare class UsersController {
    private users;
    constructor(users: UsersService);
    getById(id: string): Promise<any>;
}
