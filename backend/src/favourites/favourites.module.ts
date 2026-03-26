import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { Favourite } from './entities/favourite.entity';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite]), PropertiesModule],
  controllers: [FavouritesController],
  providers: [FavouritesService],
})
export class FavouritesModule {}
