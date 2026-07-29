"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const common_1 = require("@quravo/common");
(0, vitest_1.describe)('RequestContext AsyncLocalStorage propagation', () => {
    (0, vitest_1.it)('should maintain tenantId, userId, and requestId context across async execution boundaries', async () => {
        const store = {
            requestId: 'req-test-123',
            tenantId: 'tenant-abc-456',
            userId: 'user-789',
        };
        await common_1.RequestContext.run(store, async () => {
            (0, vitest_1.expect)(common_1.RequestContext.requestId).toBe('req-test-123');
            (0, vitest_1.expect)(common_1.RequestContext.tenantId).toBe('tenant-abc-456');
            (0, vitest_1.expect)(common_1.RequestContext.userId).toBe('user-789');
            // Async delay check
            await new Promise((resolve) => setTimeout(resolve, 10));
            (0, vitest_1.expect)(common_1.RequestContext.requestId).toBe('req-test-123');
            (0, vitest_1.expect)(common_1.RequestContext.tenantId).toBe('tenant-abc-456');
        });
        // Store should be undefined outside run block
        (0, vitest_1.expect)(common_1.RequestContext.getStore()).toBeUndefined();
    });
});
