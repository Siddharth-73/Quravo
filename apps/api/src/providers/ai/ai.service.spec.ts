import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { PATIENT_SUMMARY_PROMPT, AI_GUARDRAILS } from '@quravo/contracts';

describe('AiService', () => {
  let service: AiService;
  
  beforeEach(() => {
    const mockConfigService = {
      get: vi.fn().mockImplementation((key) => {
        if (key === 'OPENAI_API_KEY') return 'mock-api-key';
        if (key === 'AI_MODEL') return 'gpt-4o-mini';
        return null;
      }),
    };

    service = new AiService(mockConfigService as any);
  });

  it('should return mock response in dev when using mock-api-key', async () => {
    const response = await service.generateCompletion([
      { role: 'user', content: 'test' }
    ]);

    expect(response).toContain('mock AI generated summary');
  });

  it('prompt templates should enforce AI non-diagnostician guardrails', () => {
    // This test ensures that the imported prompt templates strictly append the guardrails.
    expect(AI_GUARDRAILS).toContain('You must NEVER diagnose a patient');
    expect(PATIENT_SUMMARY_PROMPT).toContain('You must NEVER diagnose a patient');
  });
});
