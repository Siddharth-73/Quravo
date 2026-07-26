import { Module } from '@nestjs/common';
import { EmrController } from './emr.controller';
import { EmrService } from './emr.service';
import { AuditService } from '../../common/services/audit.service';
import { TenantModule } from '../tenant/tenant.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [TenantModule, RbacModule],
  controllers: [EmrController],
  providers: [EmrService, AuditService],
  exports: [EmrService, AuditService],
})
export class EmrModule {}
