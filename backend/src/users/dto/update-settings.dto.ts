import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({ example: 'light', enum: ['light', 'dark'] })
  @IsString()
  @IsOptional()
  @IsIn(['light', 'dark'])
  theme: string;

  @ApiProperty({ example: 'en', enum: ['en', 'es', 'fr'] })
  @IsString()
  @IsOptional()
  language: string;
}
