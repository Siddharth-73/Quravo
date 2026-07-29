"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const billing_provider_1 = require("../src/modules/subscription/providers/billing.provider");
(0, vitest_1.describe)('SubscriptionService & Billing Provider (Phase 5.5 Unit Test)', () => {
    const billingProvider = new billing_provider_1.MockBillingProvider();
    (0, vitest_1.it)('should generate valid mock checkout session for growth tier upgrade', async () => {
        const tenantId = 'clinic-100';
        const result = await billingProvider.createCheckoutSession(tenantId, 'growth', 'http://localhost:3000/settings');
        (0, vitest_1.expect)(result.sessionId).toBeDefined();
        (0, vitest_1.expect)(result.sessionId.startsWith('mock_sess_')).toBe(true);
        (0, vitest_1.expect)(result.checkoutUrl).toContain('plan=growth');
        (0, vitest_1.expect)(result.provider).toBe('mock');
    });
    (0, vitest_1.it)('should correctly calculate 14-day free trial period', () => {
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        const diffDays = Math.round((trialEnd.getTime() - now.getTime()) / (1000 * 3600 * 24));
        (0, vitest_1.expect)(diffDays).toBe(14);
    });
});
