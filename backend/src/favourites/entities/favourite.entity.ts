import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';

@Entity()
export class Favourite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.favourites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Property, (property) => property.favourites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column('jsonb', { nullable: true })
  notes: {
    userNotes?: string;
    rating?: number;
    tags?: string[];
    reminderDate?: Date;
  };

  @CreateDateColumn()
  createdAt: Date;
}
