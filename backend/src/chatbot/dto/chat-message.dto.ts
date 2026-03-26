import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
});

export class ChatMessageDto {
  @ApiProperty({ example: 'How many properties are available?' })
  @IsString()
  @MinLength(1, { message: 'Message cannot be empty' })
  message: string;
}
