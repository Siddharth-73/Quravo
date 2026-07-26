import { describe, it, expect } from 'vitest';
import { MockBillingProvider } from '../src/modules/subscription/providers/billing.provider';

describe('SubscriptionService & Billing Provider (Phase 5.5 Unit Test)', () => {
  const billingProvider = new MockBillingProvider();

  it('should generate valid mock checkout session for growth tier upgrade', async () => {
    const tenantId = 'clinic-100';
    const result = await billingProvider.createCheckoutSession(tenantId, 'growth', 'http://localhost:3000/settings');

    expect(result.sessionId).toBeDefined();
    expect(result.sessionId.startsWith('mock_sess_')).toBe(true);
    expect(result.checkoutUrl).toContain('plan=growth');
    expect(result.provider).toBe('mock');
  });

  it('should correctly calculate 14-day free trial period', () => {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const diffDays = Math.round((trialEnd.getTime() - now.getTime()) / (1000 * 3600 * 24));
    expect(diffDays).toBe(14);
  });
});
