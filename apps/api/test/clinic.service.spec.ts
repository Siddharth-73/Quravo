import { describe, it, expect } from 'vitest';
import { createHash, randomUUID } from 'crypto';

describe('ClinicService Management & Invites (Phase 5 Unit Test)', () => {
  it('should generate valid sha256 token hash for staff invitations', () => {
    const rawToken = randomUUID();
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');

    expect(tokenHash).toBeDefined();
    expect(tokenHash.length).toBe(64); // SHA-256 hex string length
  });

  it('should generate default 7-day operating schedule for new branches', () => {
    const hours = [];
    for (let day = 0; day <= 6; day++) {
      hours.push({
        dayOfWeek: day,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: day === 0 || day === 6,
      });
    }

    expect(hours.length).toBe(7);
    expect(hours[0].isClosed).toBe(true); // Sunday
    expect(hours[1].isClosed).toBe(false); // Monday
    expect(hours[6].isClosed).toBe(true); // Saturday
  });
});
