import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from '../../database/database.service';
import { MockBillingProvider } from './providers/billing.provider';
import { subscriptions, featureFlags, eq, and } from '@quravo/db';
import { SubscriptionUpgradedEvent, SubscriptionDowngradedEvent, SubscriptionCanceledEvent } from '@quravo/common';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly billingProvider: MockBillingProvider,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async seedTrialSubscription(tenantId: string, planTier: string = 'starter') {
    const db = this.dbService.db;
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days trial

    const [subscription] = await db
      .insert(subscriptions)
      .values({
        tenantId,
        planTier: planTier as any,
        status: 'trialing',
        billingProvider: 'mock',
        currentPeriodStart,
        currentPeriodEnd,
      })
      .returning();

    return subscription;
  }

  async getSubscription(tenantId: string) {
    const db = this.dbService.db;
    let [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.tenantId, tenantId)).limit(1);

    if (!subscription) {
      subscription = await this.seedTrialSubscription(tenantId, 'starter');
    }

    return subscription;
  }

  async changePlan(tenantId: string, newPlanTier: string) {
    const db = this.dbService.db;
    let subscription = await this.getSubscription(tenantId);
    const previousPlanTier = subscription.planTier;

    if (previousPlanTier === newPlanTier) {
      return subscription;
    }

    const isUpgrade = this.isTierUpgrade(previousPlanTier, newPlanTier);

    const [updated] = await db
      .update(subscriptions)
      .set({
        planTier: newPlanTier as any,
        status: 'active',
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id))
      .returning();

    const eventPayload = {
      tenantId,
      previousPlanTier,
      newPlanTier,
      status: updated.status,
      billingProvider: updated.billingProvider,
    };

    if (isUpgrade) {
      this.eventEmitter.emit('subscription.upgraded', new SubscriptionUpgradedEvent(eventPayload));
    } else {
      this.eventEmitter.emit('subscription.downgraded', new SubscriptionDowngradedEvent(eventPayload));
    }

    return updated;
  }

  private isTierUpgrade(currentTier: string, newTier: string): boolean {
    const ranks: Record<string, number> = { starter: 1, growth: 2, erp: 3 };
    return (ranks[newTier.toLowerCase()] || 1) > (ranks[currentTier.toLowerCase()] || 1);
  }

  // --- FEATURE FLAGS ---
  async getFeatureFlags(tenantId: string) {
    const db = this.dbService.db;
    return db.select().from(featureFlags).where(eq(featureFlags.tenantId, tenantId));
  }

  async toggleFeatureFlag(tenantId: string, flagKey: string, enabled: boolean) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(featureFlags)
      .where(and(eq(featureFlags.tenantId, tenantId), eq(featureFlags.flagKey, flagKey)))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(featureFlags)
        .set({ enabled, updatedAt: new Date() })
        .where(eq(featureFlags.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(featureFlags)
      .values({ tenantId, flagKey, enabled, percentageRollout: 100 })
      .returning();

    return created;
  }

  // --- WEBHOOK HANDLING ---
  async handleWebhook(signature: string, payload: any) {
    const isValid = this.billingProvider.verifyWebhook(signature, payload);
    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Process webhook event type
    if (payload.type === 'customer.subscription.updated') {
      const tenantId = payload.data?.object?.metadata?.tenantId;
      const newPlan = payload.data?.object?.metadata?.planTier;
      if (tenantId && newPlan) {
        await this.changePlan(tenantId, newPlan);
      }
    }

    return { received: true };
  }
}
