import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from '../../database/database.service';
import { TenantCacheService } from '../tenant/tenant-cache.service';
import { roles, tenantModules, eq, and } from '@quravo/db';
import { ModuleToggledEvent, RoleUpdatedEvent, getInitialModulesForPlanTier } from '@quravo/common';

@Injectable()
export class RbacService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly tenantCacheService: TenantCacheService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async seedInitialTenantModules(tenantId: string, planTier: string) {
    const db = this.dbService.db;
    const initialModuleKeys = getInitialModulesForPlanTier(planTier);

    for (const key of initialModuleKeys) {
      await db
        .insert(tenantModules)
        .values({ tenantId, moduleKey: key, enabled: true })
        .onConflictDoNothing();
    }

    await this.tenantCacheService.invalidateTenantModules(tenantId);
  }

  async getTenantModules(tenantId: string) {
    return this.tenantCacheService.getEnabledModules(tenantId);
  }

  async toggleTenantModule(tenantId: string, moduleKey: string, enabled: boolean) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(tenantModules)
      .where(and(eq(tenantModules.tenantId, tenantId), eq(tenantModules.moduleKey, moduleKey)))
      .limit(1);

    if (existing) {
      await db
        .update(tenantModules)
        .set({ enabled, updatedAt: new Date() })
        .where(eq(tenantModules.id, existing.id));
    } else {
      await db.insert(tenantModules).values({ tenantId, moduleKey, enabled });
    }

    // Invalidate Redis cache
    await this.tenantCacheService.invalidateTenantModules(tenantId);

    // Emit ModuleToggledEvent
    this.eventEmitter.emit('tenant.module_toggled', new ModuleToggledEvent({ tenantId, moduleKey, enabled }));

    return { tenantId, moduleKey, enabled };
  }

  async getTenantRoles(tenantId: string) {
    const db = this.dbService.db;
    return db.select().from(roles).where(eq(roles.tenantId, tenantId));
  }

  async createRole(tenantId: string, name: string, description: string, permissions: string[]) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.name, name)))
      .limit(1);

    if (existing) {
      throw new ConflictException(`Role '${name}' already exists in this clinic.`);
    }

    const [role] = await db
      .insert(roles)
      .values({ tenantId, name, description, permissions })
      .returning();

    await this.tenantCacheService.invalidateRolePermissions(tenantId, name);
    this.eventEmitter.emit('tenant.role_updated', new RoleUpdatedEvent({ tenantId, roleName: name, permissions }));

    return role;
  }

  async updateRolePermissions(tenantId: string, name: string, permissions: string[]) {
    const db = this.dbService.db;

    const [role] = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.name, name)))
      .limit(1);

    if (!role) {
      throw new NotFoundException(`Role '${name}' not found.`);
    }

    const [updated] = await db
      .update(roles)
      .set({ permissions, updatedAt: new Date() })
      .where(eq(roles.id, role.id))
      .returning();

    // Invalidate Redis cache
    await this.tenantCacheService.invalidateRolePermissions(tenantId, name);

    // Emit RoleUpdatedEvent
    this.eventEmitter.emit('tenant.role_updated', new RoleUpdatedEvent({ tenantId, roleName: name, permissions }));

    return updated;
  }
}
