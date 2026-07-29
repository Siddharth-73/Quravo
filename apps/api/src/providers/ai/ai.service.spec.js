"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ai_service_1 = require("./ai.service");
const vitest_1 = require("vitest");
const contracts_1 = require("@quravo/contracts");
(0, vitest_1.describe)('AiService', () => {
    let service;
    (0, vitest_1.beforeEach)(() => {
        const mockConfigService = {
            get: vitest_1.vi.fn().mockImplementation((key) => {
                if (key === 'OPENAI_API_KEY')
                    return 'mock-api-key';
                if (key === 'AI_MODEL')
                    return 'gpt-4o-mini';
                return null;
            }),
        };
        service = new ai_service_1.AiService(mockConfigService);
    });
    (0, vitest_1.it)('should return mock response in dev when using mock-api-key', async () => {
        const response = await service.generateCompletion([
            { role: 'user', content: 'test' }
        ]);
        (0, vitest_1.expect)(response).toContain('mock AI generated summary');
    });
    (0, vitest_1.it)('prompt templates should enforce AI non-diagnostician guardrails', () => {
        // This test ensures that the imported prompt templates strictly append the guardrails.
        (0, vitest_1.expect)(contracts_1.AI_GUARDRAILS).toContain('You must NEVER diagnose a patient');
        (0, vitest_1.expect)(contracts_1.PATIENT_SUMMARY_PROMPT).toContain('You must NEVER diagnose a patient');
    });
});
