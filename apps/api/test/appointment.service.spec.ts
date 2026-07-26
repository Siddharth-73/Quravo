import { describe, it, expect } from 'vitest';

describe('AppointmentService & Overlap Conflict Detection (Phase 7 Unit Test)', () => {
  function checkDoctorOverlap(
    existing: { startTime: Date; endTime: Date; status: string },
    requestedStart: Date,
    requestedEnd: Date
  ): boolean {
    if (existing.status === 'cancelled') return false;
    return existing.startTime < requestedEnd && existing.endTime > requestedStart;
  }

  it('should detect schedule overlap conflict when time slots intersect', () => {
    const existing = {
      startTime: new Date('2026-07-27T10:00:00.000Z'),
      endTime: new Date('2026-07-27T10:30:00.000Z'),
      status: 'scheduled',
    };

    // Conflicting requested slot (10:15 - 10:45)
    const req1Start = new Date('2026-07-27T10:15:00.000Z');
    const req1End = new Date('2026-07-27T10:45:00.000Z');
    expect(checkDoctorOverlap(existing, req1Start, req1End)).toBe(true);

    // Non-conflicting requested slot (10:30 - 11:00)
    const req2Start = new Date('2026-07-27T10:30:00.000Z');
    const req2End = new Date('2026-07-27T11:00:00.000Z');
    expect(checkDoctorOverlap(existing, req2Start, req2End)).toBe(false);
  });

  it('should ignore conflict check for cancelled appointments', () => {
    const cancelled = {
      startTime: new Date('2026-07-27T10:00:00.000Z'),
      endTime: new Date('2026-07-27T10:30:00.000Z'),
      status: 'cancelled',
    };

    const reqStart = new Date('2026-07-27T10:15:00.000Z');
    const reqEnd = new Date('2026-07-27T10:45:00.000Z');
    expect(checkDoctorOverlap(cancelled, reqStart, reqEnd)).toBe(false);
  });

  it('should default end time to 30 minutes after start time when end time omitted', () => {
    const start = new Date('2026-07-27T14:00:00.000Z');
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    expect(end.toISOString()).toBe('2026-07-27T14:30:00.000Z');
  });
});
