export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiProviderInterface {
  generateCompletion(
    messages: AiMessage[],
    options?: AiCompletionOptions
  ): Promise<string>;
}
