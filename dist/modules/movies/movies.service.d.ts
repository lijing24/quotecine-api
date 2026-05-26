import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class MoviesService {
    private prisma;
    private config;
    constructor(prisma: PrismaService, config: ConfigService);
    searchTMDB(query: string): Promise<any>;
    findOne(id: string): Promise<any>;
}
