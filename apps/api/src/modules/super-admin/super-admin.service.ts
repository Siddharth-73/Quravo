import { Injectable, ConflictException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { tenants, users, tenantMemberships, tenantConfigs, tenantModules, clinicBranches, clinicListings, notifications, eq, desc } from '@quravo/db';
import * as argon2 from '@node-rs/argon2';
import { TenantService } from '../tenant/tenant.service';
import { QueueService } from '../../queue/queue.service';
import { ProvisionTenantDto } from './dto/provision-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { CreateClinicListingDto } from './dto/create-clinic-listing.dto';

@Injectable()
export class SuperAdminService {
  private readonly logger = new Logger(SuperAdminService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly tenantService: TenantService,
    private readonly queueService: QueueService,
    private readonly configService: ConfigService
  ) {}

  private getSuperAdminEmail(): string {
    return (
      this.configService.get<string>('SUPER_ADMIN_EMAIL') || 'sharmasiddharth7373@gmail.com'
    ).toLowerCase();
  }

  async createClinicListing(dto: CreateClinicListingDto) {
    const db = this.dbService.db;
    const superAdminEmail = this.getSuperAdminEmail();

    // 1. Insert listing record
    const [listing] = await db
      .insert(clinicListings)
      .values({
        clinicName: dto.clinicName,
        ownerName: dto.ownerName,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        city: dto.city,
        specialty: dto.specialty || null,
        estimatedMonthlyPatients: dto.estimatedMonthlyPatients || null,
        additionalNotes: dto.additionalNotes || null,
        status: 'pending',
      })
      .returning();

    // 2. Create in-app Notification for Super Admin
    try {
      let [superAdminUser] = await db.select().from(users).where(eq(users.email, superAdminEmail)).limit(1);
      if (!superAdminUser) {
        [superAdminUser] = await db.select().from(users).where(eq(users.email, 'admin@quravo.com')).limit(1);
      }

      const [firstTenant] = await db.select().from(tenants).limit(1);
      const tenantId = firstTenant?.id || '00000000-0000-0000-0000-000000000000';

      if (superAdminUser) {
        await db.insert(notifications).values({
          tenantId,
          userId: superAdminUser.id,
          title: `New Clinic Listing Request: ${dto.clinicName}`,
          message: `${dto.ownerName} from ${dto.city} submitted a request to list their clinic (${dto.phone}, ${dto.email}).`,
          type: 'clinic_listing_request',
          isRead: false,
        });
      }
    } catch (err: any) {
      this.logger.warn(`Could not create super admin in-app notification: ${err.message}`);
    }

    // 3. Dispatch Email Notification to Super Admin
    try {
      await this.queueService.addJob('clinic-listing-request', {
        type: 'clinic-listing-request',
        to: superAdminEmail,
        subject: `[Super Admin Alert] New Clinic Listing Request: ${dto.clinicName}`,
        clinicName: dto.clinicName,
        ownerName: dto.ownerName,
        email: dto.email,
        phone: dto.phone,
        city: dto.city,
        specialty: dto.specialty,
        estimatedMonthlyPatients: dto.estimatedMonthlyPatients,
        additionalNotes: dto.additionalNotes,
      });
    } catch (err: any) {
      this.logger.error(`Failed to queue clinic listing email to ${superAdminEmail}: ${err.message}`);
    }

    return {
      message: 'Clinic listing request submitted successfully. Super Admin notified.',
      listing,
    };
  }

  async getClinicListings() {
    const db = this.dbService.db;
    return db.select().from(clinicListings).orderBy(desc(clinicListings.createdAt));
  }

  async provisionTenant(dto: ProvisionTenantDto) {
    const db = this.dbService.db;

    const [existingTenant] = await db.select().from(tenants).where(eq(tenants.slug, dto.clinicSlug.toLowerCase())).limit(1);
    if (existingTenant) {
      throw new ConflictException('Clinic subdomain/slug is already taken.');
    }

    let [user] = await db.select().from(users).where(eq(users.email, dto.email.toLowerCase())).limit(1);

    if (!user) {
      const passwordHash = await argon2.hash('Quravo@123!');
      
      const [newUser] = await db
        .insert(users)
        .values({
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          isEmailVerified: true,
          status: 'active',
        })
        .returning();
      user = newUser;
    }

    const [tenant] = await db
      .insert(tenants)
      .values({
        name: dto.clinicName,
        slug: dto.clinicSlug.toLowerCase(),
        planTier: dto.planTier,
        status: 'active',
      })
      .returning();

    await db.insert(tenantMemberships).values({
      tenantId: tenant.id,
      userId: user.id,
      role: 'owner',
      status: 'active',
    });

    await this.tenantService.emitTenantCreatedEvent({
      tenantId: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      planTier: tenant.planTier,
      ownerUserId: user.id,
      ownerEmail: user.email,
    });

    return {
      message: 'Tenant provisioned successfully.',
      tenant,
      user: { id: user.id, email: user.email },
    };
  }

  async listTenants() {
    const db = this.dbService.db;
    const list = await db.select().from(tenants).orderBy(tenants.createdAt);

    const result = [];
    for (const t of list) {
      const branches = await db
        .select()
        .from(clinicBranches)
        .where(eq(clinicBranches.tenantId, t.id));

      result.push({
        id: t.id,
        name: t.name,
        subdomain: t.slug,
        plan: t.planTier === 'starter' ? 'Starter' : t.planTier === 'growth' ? 'Growth' : 'ERP',
        branches: branches.length,
        status: t.status === 'active' ? 'Active' : 'Suspended',
      });
    }
    return result;
  }

  async getTenantConfig(tenantId: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId)) {
      throw new BadRequestException('Invalid UUID format.');
    }

    const db = this.dbService.db;

    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    if (!tenant) {
      throw new NotFoundException('Tenant not found.');
    }

    let [config] = await db.select().from(tenantConfigs).where(eq(tenantConfigs.tenantId, tenantId)).limit(1);
    if (!config) {
      [config] = await db.insert(tenantConfigs).values({ tenantId }).returning();
    }

    const modules = await db.select().from(tenantModules).where(eq(tenantModules.tenantId, tenantId));

    return { tenant, config, modules };
  }

  async updateTenantConfig(tenantId: string, dto: UpdateTenantConfigDto) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId)) {
      throw new BadRequestException('Invalid UUID format.');
    }

    const db = this.dbService.db;

    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    if (!tenant) {
      throw new NotFoundException('Tenant not found.');
    }

    const tenantUpdates: Record<string, any> = {};
    if (dto.planTier) tenantUpdates.planTier = dto.planTier;
    if (dto.status) tenantUpdates.status = dto.status;
    if (dto.customDomain !== undefined) tenantUpdates.customDomain = dto.customDomain || null;
    tenantUpdates.updatedAt = new Date();

    if (Object.keys(tenantUpdates).length > 1) {
      await db.update(tenants).set(tenantUpdates).where(eq(tenants.id, tenantId));
    }

    const configUpdates: Record<string, any> = {};
    if (dto.primaryColor) configUpdates.primaryColor = dto.primaryColor;
    if (dto.accentColor) configUpdates.accentColor = dto.accentColor;
    if (dto.timezone) configUpdates.timezone = dto.timezone;
    if (dto.currency) configUpdates.currency = dto.currency;
    if (dto.settings) configUpdates.settings = dto.settings;
    configUpdates.updatedAt = new Date();

    const [existingConfig] = await db.select().from(tenantConfigs).where(eq(tenantConfigs.tenantId, tenantId)).limit(1);
    if (existingConfig) {
      await db.update(tenantConfigs).set(configUpdates).where(eq(tenantConfigs.tenantId, tenantId));
    } else {
      await db.insert(tenantConfigs).values({ tenantId, ...configUpdates });
    }

    return this.getTenantConfig(tenantId);
  }
}
