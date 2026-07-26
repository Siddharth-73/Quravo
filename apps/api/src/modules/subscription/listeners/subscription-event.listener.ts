import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubscriptionUpgradedEvent, SubscriptionDowngradedEvent, getInitialModulesForPlanTier } from '@quravo/common';
import { DatabaseService } from '../../../database/database.service';
import { TenantCacheService } from '../../tenant/tenant-cache.service';
import { tenantModules, tenants, eq, and } from '@quravo/db';

@Injectable()
export class SubscriptionEventListener {
  private readonly logger = new Logger(SubscriptionEventListener.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly tenantCacheService: TenantCacheService
  ) {}

  @OnEvent('subscription.upgraded')
  @OnEvent('subscription.downgraded')
  async handleSubscriptionTierChanged(event: SubscriptionUpgradedEvent | SubscriptionDowngradedEvent) {
    const { tenantId, newPlanTier } = event.data;
    this.logger.log(`⚡ Syncing tenant_modules for clinic ${tenantId} [New Tier: ${newPlanTier}]`);

    const db = this.dbService.db;

    // Update tenant planTier in tenants table
    await db.update(tenants).set({ planTier: newPlanTier as any }).where(eq(tenants.id, tenantId));

    // Get module keys for new plan tier
    const targetModuleKeys = getInitialModulesForPlanTier(newPlanTier);

    // Upsert module enablement state
    for (const key of targetModuleKeys) {
      await db
        .insert(tenantModules)
        .values({ tenantId, moduleKey: key, enabled: true })
        .onConflictDoUpdate({
          target: [tenantModules.tenantId, tenantModules.moduleKey],
          set: { enabled: true, updatedAt: new Date() },
        });
    }

    // Invalidate Redis cache
    await this.tenantCacheService.invalidateTenantModules(tenantId);
    this.logger.log(`✅ tenant_modules synchronized and Redis cache purged for tenant ${tenantId}`);
  }
}
