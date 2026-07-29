import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { TenantModule } from '../tenant/tenant.module';
import { QueueModule } from '../../queue/queue.module';

@Module({
  imports: [TenantModule, QueueModule],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}
