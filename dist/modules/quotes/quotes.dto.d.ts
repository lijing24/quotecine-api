export declare class CreateQuoteDto {
    content: string;
    movieId: string;
    tags?: string[];
}
export declare class QueryQuoteDto {
    tag?: string;
    mood?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}
export declare class SubmitTranslationDto {
    quoteId: string;
    language: string;
    content: string;
}
