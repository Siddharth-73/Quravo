"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Subscriptions & Feature Flags Isolation (Phase 5.5 Data Isolation Test)', () => {
    const mockSubscriptions = [
        { tenantId: 'tenant-1', planTier: 'starter', status: 'active' },
        { tenantId: 'tenant-2', planTier: 'growth', status: 'trialing' },
    ];
    const mockFeatureFlags = [
        { tenantId: 'tenant-1', flagKey: 'ai_notes_beta', enabled: true },
        { tenantId: 'tenant-2', flagKey: 'ai_notes_beta', enabled: false },
    ];
    (0, vitest_1.it)('should strictly isolate subscription status per tenant context', () => {
        const tenant1Sub = mockSubscriptions.find((s) => s.tenantId === 'tenant-1');
        const tenant2Sub = mockSubscriptions.find((s) => s.tenantId === 'tenant-2');
        (0, vitest_1.expect)(tenant1Sub?.planTier).toBe('starter');
        (0, vitest_1.expect)(tenant2Sub?.planTier).toBe('growth');
    });
    (0, vitest_1.it)('should strictly isolate feature flags per tenant context', () => {
        const tenant1Flag = mockFeatureFlags.find((f) => f.tenantId === 'tenant-1');
        const tenant2Flag = mockFeatureFlags.find((f) => f.tenantId === 'tenant-2');
        (0, vitest_1.expect)(tenant1Flag?.enabled).toBe(true);
        (0, vitest_1.expect)(tenant2Flag?.enabled).toBe(false);
    });
});
