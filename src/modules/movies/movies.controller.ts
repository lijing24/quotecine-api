import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private movies: MoviesService) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.movies.searchTMDB(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movies.findOne(id);
  }
}
