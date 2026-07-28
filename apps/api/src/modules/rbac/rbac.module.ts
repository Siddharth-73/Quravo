import { Module, Global, forwardRef } from '@nestjs/common';
import { RbacController } from './rbac.controller';
import { RbacService } from './rbac.service';
import { TenantModule } from '../tenant/tenant.module';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ModuleGuard } from '../../common/guards/module.guard';

@Global()
@Module({
  imports: [forwardRef(() => TenantModule)],
  controllers: [RbacController],
  providers: [RbacService, PermissionsGuard, ModuleGuard],
  exports: [RbacService, PermissionsGuard, ModuleGuard],
})
export class RbacModule {}
