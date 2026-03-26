import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async findAll(): Promise<Property[]> {
    return this.propertiesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Property | null> {
    return this.propertiesRepository.findOne({ where: { id } });
  }

  // Helper method to query JSONB fields
  async findByType(type: string): Promise<Property[]> {
    return this.propertiesRepository
      .createQueryBuilder('property')
      .where("property.data->>'type' = :type", { type })
      .orderBy('property.createdAt', 'DESC')
      .getMany();
  }

  async findByPriceRange(min: number, max: number): Promise<Property[]> {
    return this.propertiesRepository
      .createQueryBuilder('property')
      .where("CAST(property.data->>'price' AS DECIMAL) BETWEEN :min AND :max", { min, max })
      .orderBy('property.createdAt', 'DESC')
      .getMany();
  }

  async create(createPropertyDto: any): Promise<Property> {
    const property = this.propertiesRepository.create({
      data: createPropertyDto.data,
      metadata: createPropertyDto.metadata || { views: 0, tags: [] },
    });
    return this.propertiesRepository.save(property);
  }

  async update(id: string, updatePropertyDto: any): Promise<Property> {
    const property = await this.findOne(id);
    if (!property) {
      throw new Error('Property not found');
    }
    if (updatePropertyDto.data) {
      property.data = { ...property.data, ...updatePropertyDto.data };
    }
    if (updatePropertyDto.metadata) {
      property.metadata = { ...property.metadata, ...updatePropertyDto.metadata };
    }
    return this.propertiesRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    await this.propertiesRepository.delete(id);
  }
}
