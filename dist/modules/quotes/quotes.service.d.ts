import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuoteDto, QueryQuoteDto, SubmitTranslationDto } from './quotes.dto';
export declare class QuotesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryQuoteDto): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<any>;
    random(mood?: string): Promise<any>;
    create(dto: CreateQuoteDto, userId: string): Promise<any>;
    submitTranslation(dto: SubmitTranslationDto, userId: string): Promise<any>;
    getTags(): Promise<any>;
}
