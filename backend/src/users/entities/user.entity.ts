import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Favourite } from '../../favourites/entities/favourite.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column('jsonb')
  profile: {
    name: string;
    role: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    preferences?: {
      propertyTypes?: string[];
      priceRange?: { min: number; max: number };
      locations?: string[];
      notifications?: boolean;
    };
  };

  @Column('jsonb', { nullable: true })
  settings: {
    language?: string;
    theme?: string;
    timezone?: string;
  };

  @OneToMany(() => Favourite, (favourite) => favourite.user)
  favourites: Favourite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
