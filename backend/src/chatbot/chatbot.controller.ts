import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatMessageDto } from './dto/chat-message.dto';

@ApiTags('chatbot')
@Controller('chatbot')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @ApiOperation({ summary: 'Send message to chatbot' })
  async sendMessage(@Request() req, @Body() chatMessageDto: ChatMessageDto) {
    const response = await this.chatbotService.processMessage(
      chatMessageDto.message,
      req.user.userId,
    );
    return { response };
  }
}
