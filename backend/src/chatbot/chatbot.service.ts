import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private ollama: Ollama | null = null;
  private ollamaEnabled: boolean;
  private ollamaModel: string;

  constructor(
    private propertiesService: PropertiesService,
    private configService: ConfigService,
  ) {
    this.ollamaEnabled = this.configService.get<string>('CHATBOT_ENABLED') === 'true';
    this.ollamaModel = this.configService.get<string>('OLLAMA_MODEL') || 'llama2';
    
    if (this.ollamaEnabled) {
      const baseUrl = this.configService.get<string>('OLLAMA_BASE_URL') || 'http://localhost:11434';
      this.ollama = new Ollama({ host: baseUrl });
      this.logger.log(`Ollama chatbot initialized with model: ${this.ollamaModel}`);
    } else {
      this.logger.log('Chatbot running in fallback mode (Ollama disabled)');
    }
  }

  async processMessage(message: string, userId: string): Promise<string> {
    // If Ollama is enabled, use it
    if (this.ollamaEnabled && this.ollama) {
      try {
        return await this.processWithOllama(message, userId);
      } catch (error) {
        this.logger.error('Ollama error, falling back to rule-based:', error.message);
        return await this.processFallback(message, userId);
      }
    }

    // Otherwise use fallback rule-based system
    return await this.processFallback(message, userId);
  }

  private async processWithOllama(message: string, userId: string): Promise<string> {
    // Get property context
    const properties = await this.propertiesService.findAll();
    const propertyContext = this.buildPropertyContext(properties);

    // Build system prompt
    const systemPrompt = `You are a helpful real estate assistant for the "Real Estate Portal" website. You ONLY help users with questions about THIS website, its properties, features, and how to use it.

Current Property Inventory:
${propertyContext}

Guidelines:
- Be friendly and professional
- Provide specific information about properties when asked
- Help users understand how to use favourites, search, and navigate the portal
- Keep responses concise (2-3 sentences max)
- If asked about properties, reference the actual inventory above
- IMPORTANT: If a user asks questions unrelated to this real estate portal (e.g., math, science, coding, general knowledge), politely decline and say you can only help with questions about the Real Estate Portal and its properties
- You can answer questions about: property listings, pricing, locations, features, how to use favourites, how to contact agents, how the website works`;

    // Call Ollama
    const response = await this.ollama.chat({
      model: this.ollamaModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      stream: false,
    });

    return response.message.content;
  }

  private async processFallback(message: string, userId: string): Promise<string> {
    const lowerMessage = message.toLowerCase();

    // Property search queries
    if (lowerMessage.includes('property') || lowerMessage.includes('properties')) {
      const properties = await this.propertiesService.findAll();
      
      if (lowerMessage.includes('how many')) {
        return `We currently have ${properties.length} properties available for viewing.`;
      }
      
      if (lowerMessage.includes('apartment')) {
        const apartments = properties.filter(p => p.data.type === 'apartment');
        return `We have ${apartments.length} apartments available. Would you like to see them?`;
      }
      
      if (lowerMessage.includes('house')) {
        const houses = properties.filter(p => p.data.type === 'house');
        return `We have ${houses.length} houses available. Would you like to see them?`;
      }
      
      if (lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
        const affordable = properties.filter(p => p.data.price < 500000);
        return `I found ${affordable.length} properties under $500,000. Check out our property listings!`;
      }
      
      if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive')) {
        const luxury = properties.filter(p => p.data.price > 1000000);
        return `We have ${luxury.length} luxury properties over $1,000,000. These are premium listings!`;
      }
      
      return `We have ${properties.length} amazing properties available. You can browse them in the dashboard!`;
    }

    // Favourites queries
    if (lowerMessage.includes('favourite') || lowerMessage.includes('favorite')) {
      return 'You can add properties to your favourites by clicking the heart icon on any property card. Your favourites are saved in "My Favourites" section.';
    }

    // Help queries
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      return 'I can help you with:\n• Finding properties\n• Information about property types\n• Managing your favourites\n• General questions about the platform\n\nWhat would you like to know?';
    }

    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! Welcome to our Real Estate Portal. I can help you with property listings, pricing, favourites, and how to use this website. How can I assist you today?';
    }

    // Detect off-topic questions
    const websiteKeywords = ['property', 'properties', 'house', 'apartment', 'villa', 'condo',
      'price', 'buy', 'sell', 'rent', 'bedroom', 'bathroom', 'location', 'favourite', 'favorite',
      'help', 'search', 'find', 'list', 'listing', 'home', 'real estate', 'portal', 'website',
      'dashboard', 'admin', 'filter', 'sort', 'area', 'sqft', 'agent', 'sale', 'sold',
      'hello', 'hi', 'hey', 'thanks', 'thank', 'bye', 'features', 'amenities'];
    
    const isOnTopic = websiteKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (!isOnTopic) {
      return 'I\'m sorry, I can only help with questions about the Real Estate Portal — like property listings, pricing, features, favourites, and how to navigate the website. Please ask me something related to our properties!';
    }

    // Default response
    return 'I\'m here to help you with the Real Estate Portal! You can ask me about available properties, how to use favourites, pricing details, or any questions about our platform.';
  }

  private buildPropertyContext(properties: any[]): string {
    const summary = properties.map(p => 
      `- ${p.data.title}: ${p.data.type}, ${p.data.bedrooms} bed, ${p.data.bathrooms} bath, $${p.data.price.toLocaleString()}, ${p.data.location}`
    ).join('\n');

    const stats = {
      total: properties.length,
      apartments: properties.filter(p => p.data.type === 'apartment').length,
      houses: properties.filter(p => p.data.type === 'house').length,
      avgPrice: Math.round(properties.reduce((sum, p) => sum + Number(p.data.price), 0) / properties.length),
    };

    return `Total Properties: ${stats.total}
Apartments: ${stats.apartments}
Houses: ${stats.houses}
Average Price: $${stats.avgPrice.toLocaleString()}

Properties:
${summary}`;
  }
}
