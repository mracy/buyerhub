import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [PropertiesModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
