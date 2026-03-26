import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { z } from 'zod';

export const addFavouriteSchema = z.object({
  propertyId: z.string().uuid('Invalid property ID'),
});

export class AddFavouriteDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID('4', { message: 'Invalid property ID' })
  propertyId: string;
}
