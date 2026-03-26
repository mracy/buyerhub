import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favourite } from './entities/favourite.entity';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(Favourite)
    private favouritesRepository: Repository<Favourite>,
    private propertiesService: PropertiesService,
  ) {}

  async findUserFavourites(userId: string) {
    return this.favouritesRepository.find({
      where: { user: { id: userId } },
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return this.favouritesRepository.find({
      relations: ['property', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async addFavourite(userId: string, propertyId: string) {
    const property = await this.propertiesService.findOne(propertyId);
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const existing = await this.favouritesRepository.findOne({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
    });

    if (existing) {
      throw new ConflictException('Property already in favourites');
    }

    const favourite = this.favouritesRepository.create({
      user: { id: userId },
      property: { id: propertyId },
    });

    return this.favouritesRepository.save(favourite);
  }

  async removeFavourite(userId: string, propertyId: string) {
    const favourite = await this.favouritesRepository.findOne({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
    });

    if (!favourite) {
      throw new NotFoundException('Favourite not found');
    }

    await this.favouritesRepository.remove(favourite);
    return { message: 'Favourite removed successfully' };
  }

  async isFavourite(userId: string, propertyId: string): Promise<boolean> {
    const favourite = await this.favouritesRepository.findOne({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
    });
    return !!favourite;
  }
}
