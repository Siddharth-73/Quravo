import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
  provider: string;
}

export interface IBillingProvider {
  createCheckoutSession(tenantId: string, planTier: string, returnUrl: string): Promise<CheckoutSessionResult>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  changePlan(subscriptionId: string, newPlanTier: string): Promise<boolean>;
  verifyWebhook(signature: string, payload: any): boolean;
}

@Injectable()
export class MockBillingProvider implements IBillingProvider {
  private readonly logger = new Logger(MockBillingProvider.name);

  async createCheckoutSession(tenantId: string, planTier: string, returnUrl: string): Promise<CheckoutSessionResult> {
    const sessionId = `mock_sess_${randomUUID()}`;
    const checkoutUrl = `${returnUrl}?session_id=${sessionId}&plan=${planTier}&status=success`;
    this.logger.log(`💳 Created Mock Checkout Session for tenant ${tenantId} [Plan: ${planTier}]`);
    return {
      sessionId,
      checkoutUrl,
      provider: 'mock',
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    this.logger.log(`💳 Mock Cancelled subscription ${subscriptionId}`);
    return true;
  }

  async changePlan(subscriptionId: string, newPlanTier: string): Promise<boolean> {
    this.logger.log(`💳 Mock Changed subscription ${subscriptionId} to plan ${newPlanTier}`);
    return true;
  }

  verifyWebhook(signature: string, payload: any): boolean {
    return true;
  }
}
