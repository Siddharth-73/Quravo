import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_KEY } from '../decorators/require-module.decorator';
import { db, tenants, eq } from '@quravo/db';

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.getAllAndOverride<string>(MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredModule) {
      return true; // No specific module required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('Tenant information missing from request');
    }

    // In a real production app, you might cache this query using Redis
    // to avoid hitting the DB on every protected route.
    const tenantRecord = await db.query.tenants.findFirst({
      where: eq(tenants.id, user.tenantId),
    });

    if (!tenantRecord) {
      throw new ForbiddenException('Tenant not found');
    }

    if (!tenantRecord.enabledModules || !tenantRecord.enabledModules.includes(requiredModule)) {
      throw new ForbiddenException(`Your plan does not include access to the '${requiredModule}' module. Please upgrade to use this feature.`);
    }

    return true;
  }
}
