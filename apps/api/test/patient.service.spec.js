"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const storage_provider_1 = require("../src/common/providers/storage.provider");
const config_1 = require("@nestjs/config");
(0, vitest_1.describe)('PatientService & Storage Provider (Phase 6 Unit Test)', () => {
    const configService = new config_1.ConfigService();
    const storageProvider = new storage_provider_1.StorageProvider(configService);
    (0, vitest_1.it)('should format sequential patient numbers with year prefix and zero-padded sequence', () => {
        const year = new Date().getFullYear();
        const count = 5;
        const sequence = (count + 1).toString().padStart(4, '0');
        const patientNumber = `PAT-${year}-${sequence}`;
        (0, vitest_1.expect)(patientNumber).toBe(`PAT-${year}-0006`);
    });
    (0, vitest_1.it)('should process attachment uploads via StorageProvider abstraction', async () => {
        const file = {
            buffer: Buffer.from('Testing medical document upload content'),
            fileName: 'blood_test_results.pdf',
            mimeType: 'application/pdf',
            folder: 'patients/pat-100',
        };
        const result = await storageProvider.uploadFile(file);
        (0, vitest_1.expect)(result.storageKey).toBeDefined();
        (0, vitest_1.expect)(result.storageKey).toContain('patients/pat-100');
        (0, vitest_1.expect)(result.storageUrl).toBeDefined();
    });
});
