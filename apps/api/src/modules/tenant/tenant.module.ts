import { Module, Global, forwardRef } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { TenantCreatedListener } from './listeners/tenant-created.listener';
import { TenantCacheService } from './tenant-cache.service';
import { RbacModule } from '../rbac/rbac.module';
import { ClinicModule } from '../clinic/clinic.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Global()
@Module({
  imports: [forwardRef(() => RbacModule), forwardRef(() => ClinicModule), forwardRef(() => SubscriptionModule)],
  controllers: [TenantController],
  providers: [TenantService, TenantCreatedListener, TenantCacheService],
  exports: [TenantService, TenantCacheService],
})
export class TenantModule {}
