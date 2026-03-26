import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class PropertyDataDto {
  @ApiProperty({ example: 'Modern Apartment' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A beautiful modern apartment in the city center.' })
  @IsString()
  description: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'New York' })
  @IsString()
  location: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  bedrooms: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  bathrooms: number;

  @ApiProperty({ example: 850 })
  @IsNumber()
  area: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'apartment', enum: ['apartment', 'house', 'villa', 'condo'] })
  @IsString()
  type: string;

  @ApiProperty({ example: ['AC', 'Gym'], required: false })
  @IsArray()
  @IsOptional()
  features?: string[];

  @ApiProperty({ example: ['Parking', 'Pool'], required: false })
  @IsArray()
  @IsOptional()
  amenities?: string[];

  @ApiProperty({ example: 2020, required: false })
  @IsNumber()
  @IsOptional()
  yearBuilt?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  parking?: number;

  @ApiProperty({ example: 'available', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}

class PropertyMetadataDto {
  @ApiProperty({ example: 0, required: false })
  @IsNumber()
  @IsOptional()
  views?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  featured?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  verified?: boolean;

  @ApiProperty({ example: ['new', 'hot'], required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class CreatePropertyDto {
  @ApiProperty({ type: PropertyDataDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PropertyDataDto)
  data: PropertyDataDto;

  @ApiProperty({ type: PropertyMetadataDto, required: false })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => PropertyMetadataDto)
  metadata?: PropertyMetadataDto;
}
