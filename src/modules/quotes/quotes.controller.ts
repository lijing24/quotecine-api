import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, QueryQuoteDto, SubmitTranslationDto } from './quotes.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('quotes')
export class QuotesController {
  constructor(private quotes: QuotesService) {}

  @Get()
  findAll(@Query() query: QueryQuoteDto) {
    return this.quotes.findAll(query);
  }

  @Get('random')
  random(@Query('mood') mood?: string) {
    return this.quotes.random(mood);
  }

  @Get('tags')
  getTags() {
    return this.quotes.getTags();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotes.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateQuoteDto, @CurrentUser() userId: string) {
    return this.quotes.create(dto, userId);
  }

  @Post(':id/translations')
  @UseGuards(JwtAuthGuard)
  submitTranslation(@Param('id') id: string, @Body() dto: SubmitTranslationDto, @CurrentUser() userId: string) {
    return this.quotes.submitTranslation({ ...dto, quoteId: id }, userId);
  }
}
