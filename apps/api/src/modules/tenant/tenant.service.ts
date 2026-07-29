import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from '../../database/database.service';
import { tenants, customDomains, roles, eq } from '@quravo/db';
import { TenantCreatedEvent } from '@quravo/common';
import { UpdateTenantDto } from './dto/update-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async getTenantBySlug(slug: string) {
    const db = this.dbService.db;
    const [tenant] = await db.select().from(tenants).where(eq(tenants.slug, slug.toLowerCase())).limit(1);

    if (!tenant) {
      throw new NotFoundException(`Clinic with subdomain '${slug}' not found.`);
    }

    if (tenant.status === 'suspended') {
      throw new ForbiddenException('Clinic account is suspended.');
    }

    return tenant;
  }

  async getTenantById(id: string) {
    const db = this.dbService.db;
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);

    if (!tenant) {
      throw new NotFoundException('Clinic not found.');
    }

    return tenant;
  }

  async updateTenant(id: string, dto: UpdateTenantDto) {
    const db = this.dbService.db;
    const [existing] = await db.select().from(tenants).where(eq(tenants.id, id)).limit(1);

    if (!existing) {
      throw new NotFoundException('Clinic profile not found.');
    }

    const [updated] = await db
      .update(tenants)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(tenants.id, id))
      .returning();

    return updated;
  }

  async emitTenantCreatedEvent(data: {
    tenantId: string;
    name: string;
    slug: string;
    planTier: string;
    ownerUserId: string;
    ownerEmail: string;
  }) {
    const event = new TenantCreatedEvent(data);
    this.eventEmitter.emit('tenant.created', event);
    return event;
  }
}
