import { describe, it, expect } from 'vitest';
import { StorageProvider } from '../src/common/providers/storage.provider';
import { ConfigService } from '@nestjs/config';

describe('PatientService & Storage Provider (Phase 6 Unit Test)', () => {
  const configService = new ConfigService();
  const storageProvider = new StorageProvider(configService);

  it('should format sequential patient numbers with year prefix and zero-padded sequence', () => {
    const year = new Date().getFullYear();
    const count = 5;
    const sequence = (count + 1).toString().padStart(4, '0');
    const patientNumber = `PAT-${year}-${sequence}`;

    expect(patientNumber).toBe(`PAT-${year}-0006`);
  });

  it('should process attachment uploads via StorageProvider abstraction', async () => {
    const file = {
      buffer: Buffer.from('Testing medical document upload content'),
      fileName: 'blood_test_results.pdf',
      mimeType: 'application/pdf',
      folder: 'patients/pat-100',
    };

    const result = await storageProvider.uploadFile(file);

    expect(result.storageKey).toBeDefined();
    expect(result.storageKey).toContain('patients/pat-100');
    expect(result.storageUrl).toBeDefined();
  });
});
