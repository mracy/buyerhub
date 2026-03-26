import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { FavouritesModule } from './favourites/favourites.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    FavouritesModule,
    ChatbotModule,
  ],
})
export class AppModule {
  static forRoot(): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        AuthModule,
        UsersModule,
        PropertiesModule,
        FavouritesModule,
      ],
    };
  }

  constructor(private configService: ConfigService) {
    const chatbotEnabled = this.configService.get<string>('CHATBOT_ENABLED') === 'true';
    if (chatbotEnabled) {
      console.log('✅ Chatbot module enabled with Ollama');
    } else {
      console.log('ℹ️  Chatbot module disabled (set CHATBOT_ENABLED=true to enable)');
    }
  }
}

