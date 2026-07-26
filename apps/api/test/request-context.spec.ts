import { describe, it, expect } from 'vitest';
import { RequestContext } from '@quravo/common';

describe('RequestContext AsyncLocalStorage propagation', () => {
  it('should maintain tenantId, userId, and requestId context across async execution boundaries', async () => {
    const store = {
      requestId: 'req-test-123',
      tenantId: 'tenant-abc-456',
      userId: 'user-789',
    };

    await RequestContext.run(store, async () => {
      expect(RequestContext.requestId).toBe('req-test-123');
      expect(RequestContext.tenantId).toBe('tenant-abc-456');
      expect(RequestContext.userId).toBe('user-789');

      // Async delay check
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(RequestContext.requestId).toBe('req-test-123');
      expect(RequestContext.tenantId).toBe('tenant-abc-456');
    });

    // Store should be undefined outside run block
    expect(RequestContext.getStore()).toBeUndefined();
  });
});
