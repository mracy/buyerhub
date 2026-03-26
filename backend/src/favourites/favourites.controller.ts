import { Controller, Get, Post, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FavouritesService } from './favourites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favourites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user favourites' })
  @ApiQuery({ name: 'global', required: false, type: Boolean, description: 'Return all favourites (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of favourite properties' })
  async getUserFavourites(@Request() req, @Query('global') global?: string) {
    const isGlobal = global === 'true';
    if (req.user.role === 'admin' && isGlobal) {
      return this.favouritesService.findAll();
    }
    return this.favouritesService.findUserFavourites(req.user.userId);
  }

  @Post(':propertyId')
  @ApiOperation({ summary: 'Add property to favourites' })
  @ApiParam({ name: 'propertyId', description: 'Property UUID' })
  @ApiResponse({ status: 201, description: 'Added to favourites' })
  async addFavourite(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favouritesService.addFavourite(req.user.userId, propertyId);
  }

  @Delete(':propertyId')
  @ApiOperation({ summary: 'Remove property from favourites' })
  @ApiParam({ name: 'propertyId', description: 'Property UUID' })
  @ApiResponse({ status: 200, description: 'Removed from favourites' })
  async removeFavourite(@Request() req, @Param('propertyId') propertyId: string) {
    await this.favouritesService.removeFavourite(req.user.userId, propertyId);
    return { message: 'Removed from favourites' };
  }
}
