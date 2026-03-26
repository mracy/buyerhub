import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Favourite } from '../../favourites/entities/favourite.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb')
  data: {
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    imageUrl?: string;
    type: string;
    features?: string[];
    amenities?: string[];
    yearBuilt?: number;
    parking?: number;
    status?: string;
  };

  @Column('jsonb', { nullable: true })
  metadata: {
    views?: number;
    lastViewed?: Date;
    featured?: boolean;
    verified?: boolean;
    tags?: string[];
  };

  @OneToMany(() => Favourite, (favourite) => favourite.property)
  favourites: Favourite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
