import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentsService } from './payments.service';
import { RazorpayProvider } from '../providers/razorpay.provider';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockEventEmitter: any;
  let mockRazorpayProvider: Partial<RazorpayProvider>;

  beforeEach(() => {
    mockEventEmitter = { emit: vi.fn() };
    mockRazorpayProvider = {
      isConfigured: vi.fn().mockReturnValue(false),
      getPublicKeyId: vi.fn().mockReturnValue(undefined),
      createOrder: vi.fn(),
      verifyPaymentSignature: vi.fn(),
      verifyWebhookSignature: vi.fn(),
    };
    service = new PaymentsService(mockEventEmitter, mockRazorpayProvider as RazorpayProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
