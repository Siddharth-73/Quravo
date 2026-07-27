import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentsService } from './payments.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockDbService: any;
  let mockQueueService: any;
  let mockEventEmitter: any;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 'pay-1' }]),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    };

    mockDbService = { db: mockDb };
    mockQueueService = { addJob: vi.fn() };
    mockEventEmitter = { emit: vi.fn() };

    service = new PaymentsService(mockDbService, mockQueueService, mockEventEmitter);
  });

  it('should reject payment if invoice not found', async () => {
    mockDb.limit.mockResolvedValueOnce([]); // Invoice not found
    
    await expect(service.createPayment('t-1', 'u-1', {
      invoiceId: 'inv-1',
      amount: 50,
      paymentMethod: 'cash'
    })).rejects.toThrow(NotFoundException);
  });

  it('should reject payment if amount exceeds amount due', async () => {
    mockDb.limit.mockResolvedValueOnce([{
      id: 'inv-1',
      status: 'pending',
      amountDue: '100.00',
      totalAmount: '100.00',
      tenantId: 't-1'
    }]);
    
    await expect(service.createPayment('t-1', 'u-1', {
      invoiceId: 'inv-1',
      amount: 150, // Exceeds 100
      paymentMethod: 'cash'
    })).rejects.toThrow(BadRequestException);
  });

  it('should successfully record payment and update invoice status', async () => {
    mockDb.limit.mockResolvedValueOnce([{
      id: 'inv-1',
      status: 'pending',
      amountDue: '100.00',
      totalAmount: '100.00',
      tenantId: 't-1',
      patientId: 'p-1'
    }]);
    
    await service.createPayment('t-1', 'u-1', {
      invoiceId: 'inv-1',
      amount: 100,
      paymentMethod: 'cash'
    });

    expect(mockDb.insert).toHaveBeenCalled(); // Payment inserted
    expect(mockDb.update).toHaveBeenCalled(); // Invoice updated
    expect(mockDb.set).toHaveBeenCalledWith(expect.objectContaining({
      status: 'paid',
      amountDue: '0.00'
    }));
    expect(mockEventEmitter.emit).toHaveBeenCalledWith('payment.collected', expect.any(Object));
  });

  it('should set invoice to partially_paid if amount is less than due', async () => {
    mockDb.limit.mockResolvedValueOnce([{
      id: 'inv-1',
      status: 'pending',
      amountDue: '100.00',
      totalAmount: '100.00',
      tenantId: 't-1',
      patientId: 'p-1'
    }]);
    
    await service.createPayment('t-1', 'u-1', {
      invoiceId: 'inv-1',
      amount: 40,
      paymentMethod: 'cash'
    });

    expect(mockDb.set).toHaveBeenCalledWith(expect.objectContaining({
      status: 'partially_paid',
      amountDue: '60.00'
    }));
  });
});
