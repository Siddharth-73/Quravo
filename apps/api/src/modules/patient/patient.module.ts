import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { StorageProvider } from '../../common/providers/storage.provider';
import { TenantModule } from '../tenant/tenant.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [TenantModule, RbacModule],
  controllers: [PatientController],
  providers: [PatientService, StorageProvider],
  exports: [PatientService, StorageProvider],
})
export class PatientModule {}
