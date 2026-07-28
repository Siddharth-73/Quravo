import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { MockBillingProvider } from './providers/billing.provider';
import { SubscriptionEventListener } from './listeners/subscription-event.listener';
import { TenantModule } from '../tenant/tenant.module';
import { RbacModule } from '../rbac/rbac.module';
import { FeatureFlagGuard } from '../../common/guards/feature-flag.guard';

@Module({
  imports: [forwardRef(() => TenantModule), forwardRef(() => RbacModule)],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, MockBillingProvider, SubscriptionEventListener, FeatureFlagGuard],
  exports: [SubscriptionService, MockBillingProvider, FeatureFlagGuard],
})
export class SubscriptionModule {}
