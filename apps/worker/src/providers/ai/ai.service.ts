import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProviderInterface, AiMessage, AiCompletionOptions } from './ai.interface';

@Injectable()
export class AiService implements AiProviderInterface {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly defaultModel: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey =
      this.configService.get<string>('GEMINI_API_KEY') ||
      this.configService.get<string>('GOOGLE_API_KEY') ||
      'mock-api-key';
    this.defaultModel = this.configService.get<string>('AI_MODEL') || 'gemini-2.5-flash';
  }

  async generateCompletion(messages: AiMessage[], options?: AiCompletionOptions): Promise<string> {
    try {
      this.logger.log(`Generating Gemini AI completion in worker with ${messages.length} messages`);

      if (this.apiKey === 'mock-api-key') {
        this.logger.debug('Using mock Gemini AI response in worker due to mock-api-key');
        return 'This is a background AI processing task executed via Google Gemini API.';
      }

      const model = options?.model || this.defaultModel;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

      const systemMessage = messages.find((m) => m.role === 'system');
      const chatMessages = messages.filter((m) => m.role !== 'system');

      const contents = chatMessages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const body: any = {
        contents,
        generationConfig: {
          temperature: options?.temperature ?? 0.3,
          maxOutputTokens: options?.maxTokens ?? 2048,
        },
      };

      if (systemMessage) {
        body.systemInstruction = {
          parts: [{ text: systemMessage.content }],
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Gemini API HTTP Error in worker ${response.status}: ${errorText}`);
        throw new Error(`Gemini API HTTP ${response.status}`);
      }

      const data: any = await response.json();
      const textResult =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '';

      return textResult;
    } catch (error: any) {
      this.logger.error('Failed to generate Gemini AI completion in worker', error);
      throw new Error(`Gemini AI Generation failed: ${error.message}`);
    }
  }
}
