import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TenantCreatedEvent } from '@quravo/common';
import { DatabaseService } from '../../../database/database.service';
import { QueueService } from '../../../queue/queue.service';
import { RbacService } from '../../rbac/rbac.service';
import { ClinicService } from '../../clinic/clinic.service';
import { SubscriptionService } from '../../subscription/subscription.service';
import { roles } from '@quravo/db';

@Injectable()
export class TenantCreatedListener {
  private readonly logger = new Logger(TenantCreatedListener.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly queueService: QueueService,
    private readonly rbacService: RbacService,
    private readonly clinicService: ClinicService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  @OnEvent('tenant.created')
  async handleTenantCreated(event: TenantCreatedEvent) {
    this.logger.log(`🎉 Handling TenantCreatedEvent for clinic: ${event.data.name} [ID: ${event.data.tenantId}]`);

    const db = this.dbService.db;

    // Seed default platform RBAC roles
    const defaultRoles = [
      { name: 'owner', description: 'Clinic Owner & Administrator', permissions: ['*'] },
      { name: 'admin', description: 'Clinic Operations Administrator', permissions: ['users:read', 'users:write', 'appointments:*', 'patients:*'] },
      { name: 'doctor', description: 'Medical Doctor / Physician', permissions: ['appointments:*', 'patients:*', 'emr:*', 'prescriptions:*'] },
      { name: 'nurse', description: 'Nursing & Clinical Staff', permissions: ['patients:read', 'appointments:read', 'vitals:write'] },
      { name: 'receptionist', description: 'Front Desk & Patient Intake', permissions: ['appointments:*', 'patients:read', 'patients:write'] },
      { name: 'accountant', description: 'Billing & Financial Manager', permissions: ['billing:*', 'reports:read'] },
      { name: 'staff', description: 'General Staff Member', permissions: ['appointments:read'] },
      { name: 'patient', description: 'Patient Portal Account', permissions: ['portal:*'] },
    ];

    try {
      await db.insert(roles).values(
        defaultRoles.map((role) => ({
          tenantId: event.data.tenantId,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        }))
      );
      this.logger.log(`✅ Default RBAC roles seeded for tenant ${event.data.slug}`);

      // Seed tier-based tenant modules
      await this.rbacService.seedInitialTenantModules(event.data.tenantId, event.data.planTier);
      this.logger.log(`✅ Default tier modules seeded for tenant ${event.data.slug} [Plan: ${event.data.planTier}]`);

      // Seed Main Branch & Working Hours
      await this.clinicService.seedMainBranch(event.data.tenantId, event.data.name);
      this.logger.log(`✅ Main Branch & default operating hours seeded for tenant ${event.data.slug}`);

      // Seed 14-Day Free Trial Subscription
      await this.subscriptionService.seedTrialSubscription(event.data.tenantId, event.data.planTier);
      this.logger.log(`✅ 14-Day Free Trial subscription seeded for tenant ${event.data.slug}`);
    } catch (err: any) {
      this.logger.error(`Failed to seed RBAC roles/modules/branches/subscriptions for tenant ${event.data.tenantId}: ${err.message}`);
    }

    // Enqueue onboarding welcome email job
    try {
      await this.queueService.addJob('welcome-clinic', {
        type: 'welcome-clinic',
        to: event.data.ownerEmail,
        subject: `Welcome to Quravo Platform — ${event.data.name}`,
        firstName: event.data.name,
        verificationUrl: `http://${event.data.slug}.localhost:3000/dashboard`,
      } as any);
      this.logger.log(`📧 Onboarding email queued for clinic owner ${event.data.ownerEmail}`);
    } catch (err: any) {
      this.logger.error(`Failed to queue onboarding email: ${err.message}`);
    }
  }
}
