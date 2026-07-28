import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { tenants, users, tenantMemberships, tenantConfigs, tenantModules, clinicBranches, eq } from '@quravo/db';
import * as argon2 from '@node-rs/argon2';
import { TenantService } from '../tenant/tenant.service';
import { ProvisionTenantDto } from './dto/provision-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';

@Injectable()
export class SuperAdminService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly tenantService: TenantService
  ) {}

  async provisionTenant(dto: ProvisionTenantDto) {
    const db = this.dbService.db;

    // Check if tenant slug exists
    const [existingTenant] = await db.select().from(tenants).where(eq(tenants.slug, dto.clinicSlug.toLowerCase())).limit(1);
    if (existingTenant) {
      throw new ConflictException('Clinic subdomain/slug is already taken.');
    }

    // Check if user already exists
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

    // Create Tenant
    const [tenant] = await db
      .insert(tenants)
      .values({
        name: dto.clinicName,
        slug: dto.clinicSlug.toLowerCase(),
        planTier: dto.planTier,
        status: 'active',
      })
      .returning();

    // Link user to tenant
    await db.insert(tenantMemberships).values({
      tenantId: tenant.id,
      userId: user.id,
      role: 'owner',
      status: 'active',
    });

    // Emit event
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

    // Get or create config
    let [config] = await db.select().from(tenantConfigs).where(eq(tenantConfigs.tenantId, tenantId)).limit(1);
    if (!config) {
      [config] = await db.insert(tenantConfigs).values({ tenantId }).returning();
    }

    // Get enabled modules
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

    // Update tenant-level fields
    const tenantUpdates: Record<string, any> = {};
    if (dto.planTier) tenantUpdates.planTier = dto.planTier;
    if (dto.status) tenantUpdates.status = dto.status;
    if (dto.customDomain !== undefined) tenantUpdates.customDomain = dto.customDomain || null;
    tenantUpdates.updatedAt = new Date();

    if (Object.keys(tenantUpdates).length > 1) {
      await db.update(tenants).set(tenantUpdates).where(eq(tenants.id, tenantId));
    }

    // Update config-level fields
    const configUpdates: Record<string, any> = {};
    if (dto.primaryColor) configUpdates.primaryColor = dto.primaryColor;
    if (dto.accentColor) configUpdates.accentColor = dto.accentColor;
    if (dto.timezone) configUpdates.timezone = dto.timezone;
    if (dto.currency) configUpdates.currency = dto.currency;
    if (dto.settings) configUpdates.settings = dto.settings;
    configUpdates.updatedAt = new Date();

    // Upsert config
    const [existingConfig] = await db.select().from(tenantConfigs).where(eq(tenantConfigs.tenantId, tenantId)).limit(1);
    if (existingConfig) {
      await db.update(tenantConfigs).set(configUpdates).where(eq(tenantConfigs.tenantId, tenantId));
    } else {
      await db.insert(tenantConfigs).values({ tenantId, ...configUpdates });
    }

    // Fetch updated state
    return this.getTenantConfig(tenantId);
  }
}
