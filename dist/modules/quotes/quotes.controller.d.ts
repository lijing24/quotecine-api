import { QuotesService } from './quotes.service';
import { CreateQuoteDto, QueryQuoteDto, SubmitTranslationDto } from './quotes.dto';
export declare class QuotesController {
    private quotes;
    constructor(quotes: QuotesService);
    findAll(query: QueryQuoteDto): Promise<{
        items: any;
        total: any;
        page: number;
        limit: number;
        pages: number;
    }>;
    random(mood?: string): Promise<any>;
    getTags(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(dto: CreateQuoteDto, userId: string): Promise<any>;
    submitTranslation(id: string, dto: SubmitTranslationDto, userId: string): Promise<any>;
}
