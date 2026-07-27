import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvoicesService } from './invoices.service';
import { NotFoundException } from '@nestjs/common';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let mockEventEmitter: any;

  beforeEach(() => {
    mockEventEmitter = { emit: vi.fn() };
    service = new InvoicesService(mockEventEmitter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
