import { IsString, IsArray, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateQuoteDto {
  @IsString() content: string;
  @IsString() movieId: string;
  @IsArray() @IsString({ each: true }) @IsOptional() tags?: string[];
}

export class QueryQuoteDto {
  @IsOptional() @IsString() tag?: string;
  @IsOptional() @IsString() mood?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() sort?: string;
  @IsOptional() page?: number = 1;
  @IsOptional() limit?: number = 20;
}

export class SubmitTranslationDto {
  @IsString() quoteId: string;
  @IsString() language: string;
  @IsString() content: string;
}
