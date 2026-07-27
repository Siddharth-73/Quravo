import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockEventEmitter: any;

  beforeEach(() => {
    mockEventEmitter = { emit: vi.fn() };
    service = new PaymentsService(mockEventEmitter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
