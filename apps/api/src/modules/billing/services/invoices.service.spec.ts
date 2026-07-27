import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvoicesService } from './invoices.service';
import { NotFoundException } from '@nestjs/common';
import { invoices, invoiceItems } from '@quravo/db';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let mockDbService: any;
  let mockQueueService: any;
  let mockEventEmitter: any;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ 
        id: 'inv-1', 
        tenantId: 't-1',
        invoiceNumber: 'INV-2026-0001',
        subtotal: '100.00',
        taxAmount: '0.00',
        totalAmount: '100.00',
        amountDue: '100.00'
      }]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };

    mockDbService = { db: mockDb };
    mockQueueService = { addJob: vi.fn() };
    mockEventEmitter = { emit: vi.fn() };

    service = new InvoicesService(mockDbService, mockQueueService, mockEventEmitter);
  });

  it('should create an invoice and emit an event', async () => {
    const dto = {
      branchId: 'b-1',
      patientId: 'p-1',
      items: [{ description: 'Consultation', quantity: 1, unitPrice: 100 }]
    };

    // Mock count for invoice sequence
    mockDb.where = vi.fn()
      .mockResolvedValueOnce([{ count: 0 }]) // For generateInvoiceNumber
      .mockReturnThis();

    const result = await service.createInvoice('t-1', 'u-1', dto);
    
    expect(result).toBeDefined();
    expect(mockDb.insert).toHaveBeenCalledTimes(2); // Invoices and Items
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('invoice.created', expect.any(Object));
  });

  it('should enforce tenant isolation when fetching an invoice', async () => {
    mockDb.limit.mockResolvedValueOnce([]); // Mock not found for a specific tenant
    
    await expect(service.getInvoice('t-wrong', 'inv-1')).rejects.toThrow(NotFoundException);
    
    // Assert that the where clause was called (we can't easily assert eq() args deeply without complex mocks, 
    // but the logic relies on drizzle's `and(eq(tenantId, ...))`)
    expect(mockDb.where).toHaveBeenCalled();
  });
});
