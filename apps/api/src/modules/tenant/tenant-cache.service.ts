import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { DatabaseService } from '../../database/database.service';
import { tenantModules, roles, tenantConfigs, eq, and } from '@quravo/db';

@Injectable()
export class TenantCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TenantCacheService.name);
  private redisConnection!: Redis;
  private readonly TTL_SECONDS = 600; // 10 minutes

  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: DatabaseService
  ) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisConnection = new Redis({
      host,
      port,
      maxRetriesPerRequest: null,
    });
  }

  async getEnabledModules(tenantId: string): Promise<Record<string, boolean>> {
    const cacheKey = `tenant:modules:${tenantId}`;
    try {
      const cached = await this.redisConnection.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err: any) {
      this.logger.warn(`Redis read error: ${err.message}`);
    }

    // Fallback to Database
    const db = this.dbService.db;
    const records = await db.select().from(tenantModules).where(eq(tenantModules.tenantId, tenantId));

    const moduleMap: Record<string, boolean> = {};
    for (const record of records) {
      moduleMap[record.moduleKey] = record.enabled;
    }

    try {
      await this.redisConnection.set(cacheKey, JSON.stringify(moduleMap), 'EX', this.TTL_SECONDS);
    } catch (err: any) {
      this.logger.warn(`Redis set error: ${err.message}`);
    }

    return moduleMap;
  }

  async getRolePermissions(tenantId: string, roleName: string): Promise<string[]> {
    const cacheKey = `tenant:permissions:${tenantId}:${roleName}`;
    try {
      const cached = await this.redisConnection.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (err: any) {
      this.logger.warn(`Redis read error: ${err.message}`);
    }

    // Fallback to Database
    const db = this.dbService.db;
    const [roleRecord] = await db
      .select()
      .from(roles)
      .where(and(eq(roles.tenantId, tenantId), eq(roles.name, roleName)))
      .limit(1);

    const permissions: string[] = roleRecord?.permissions || [];

    try {
      await this.redisConnection.set(cacheKey, JSON.stringify(permissions), 'EX', this.TTL_SECONDS);
    } catch (err: any) {
      this.logger.warn(`Redis set error: ${err.message}`);
    }

    return permissions;
  }

  async invalidateTenantModules(tenantId: string): Promise<void> {
    const cacheKey = `tenant:modules:${tenantId}`;
    try {
      await this.redisConnection.del(cacheKey);
      this.logger.log(`Cleared Redis cache for ${cacheKey}`);
    } catch (err: any) {
      this.logger.warn(`Redis del error: ${err.message}`);
    }
  }

  async invalidateRolePermissions(tenantId: string, roleName: string): Promise<void> {
    const cacheKey = `tenant:permissions:${tenantId}:${roleName}`;
    try {
      await this.redisConnection.del(cacheKey);
      this.logger.log(`Cleared Redis cache for ${cacheKey}`);
    } catch (err: any) {
      this.logger.warn(`Redis del error: ${err.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.redisConnection) {
      await this.redisConnection.quit();
    }
  }
}
