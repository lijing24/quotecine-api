import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('me/collections')
@UseGuards(JwtAuthGuard)
export class CollectionsController {
  constructor(private collections: CollectionsService) {}

  @Get()
  getMyCollections(@CurrentUser() userId: string) {
    return this.collections.getUserCollections(userId);
  }

  @Get('favorites')
  getMyFavorites(@CurrentUser() userId: string) {
    return this.collections.getFavorites(userId);
  }

  @Post('favorites/:quoteId')
  toggleFavorite(@CurrentUser() userId: string, @Param('quoteId') quoteId: string) {
    return this.collections.toggleFavorite(userId, quoteId);
  }

  @Post()
  createCollection(@CurrentUser() userId: string, @Body() body: { name: string; description?: string }) {
    return this.collections.createCollection(userId, body.name, body.description);
  }

  @Post(':collectionId/items/:quoteId')
  addItem(
    @CurrentUser() userId: string,
    @Param('collectionId') collectionId: string,
    @Param('quoteId') quoteId: string,
  ) {
    return this.collections.addToCollection(userId, collectionId, quoteId);
  }

  @Delete(':collectionId/items/:quoteId')
  removeItem(
    @CurrentUser() userId: string,
    @Param('collectionId') collectionId: string,
    @Param('quoteId') quoteId: string,
  ) {
    return this.collections.removeFromCollection(userId, collectionId, quoteId);
  }
}
