import { Injectable, NestMiddleware, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../../database/database.service';
import { RequestContext } from '@quravo/common';
import { tenants, eq } from '@quravo/db';

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: string;
        name: string;
        slug: string;
        planTier: string;
        status: string;
      };
    }
  }
}

@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  constructor(private readonly dbService: DatabaseService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers['host'] || '';
    const headerSlug = req.headers['x-tenant-slug'] as string | undefined;
    const headerTenantId = req.headers['x-tenant-id'] as string | undefined;

    let slug: string | null = null;

    // 1. Try resolving slug from Subdomain in Host header
    if (host.includes('.')) {
      const parts = host.split('.');
      // If host is metro-health.platform.com or metro-health.localhost:4000
      if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'api' && !parts[0].includes('localhost')) {
        slug = parts[0].toLowerCase();
      }
    }

    // 2. Fallback to header slug if host parsing did not match
    if (!slug && headerSlug) {
      slug = headerSlug.toLowerCase();
    }

    const db = this.dbService.db;
    let resolvedTenant = null;

    if (slug) {
      const [found] = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
      resolvedTenant = found;
    } else if (headerTenantId) {
      const [found] = await db.select().from(tenants).where(eq(tenants.id, headerTenantId)).limit(1);
      resolvedTenant = found;
    }

    if (resolvedTenant) {
      if (resolvedTenant.status === 'suspended') {
        throw new ForbiddenException('Tenant account is currently suspended.');
      }

      req.tenant = {
        id: resolvedTenant.id,
        name: resolvedTenant.name,
        slug: resolvedTenant.slug,
        planTier: resolvedTenant.planTier,
        status: resolvedTenant.status,
      };

      RequestContext.setTenantId(resolvedTenant.id);
    }

    next();
  }
}
