import { Controller, Get, Post, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FavouritesService } from './favourites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('favourites')
@Controller('favourites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user favourites' })
  @ApiQuery({ name: 'global', required: false, type: Boolean })
  async getUserFavourites(@Request() req, @Query('global') global?: string) {
    // If admin, they can see all favourites if requested
    const isGlobal = global === 'true';
    if (req.user.role === 'admin' && isGlobal) {
      return this.favouritesService.findAll();
    }
    return this.favouritesService.findUserFavourites(req.user.userId);
  }

  @Post(':propertyId')
  @ApiOperation({ summary: 'Add property to favourites' })
  async addFavourite(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favouritesService.addFavourite(req.user.userId, propertyId);
  }

  @Delete(':propertyId')
  @ApiOperation({ summary: 'Remove property from favourites' })
  async removeFavourite(@Request() req, @Param('propertyId') propertyId: string) {
    return this.favouritesService.removeFavourite(req.user.userId, propertyId);
  }
}
