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

    if (!user || !user.tenantId || user.tenantId === '00000000-0000-0000-0000-000000000000') {
      return true; // Allow global/superadmin or unassigned tenant context
    }

    try {
      const tenantRecord = await db.query.tenants.findFirst({
        where: eq(tenants.id, user.tenantId),
      });

      if (!tenantRecord) {
        return true; // Allow access if tenant record was not found in cache
      }

      if (
        tenantRecord.enabledModules &&
        Array.isArray(tenantRecord.enabledModules) &&
        !tenantRecord.enabledModules.includes(requiredModule)
      ) {
        throw new ForbiddenException(
          `Your plan does not include access to the '${requiredModule}' module. Please upgrade to use this feature.`
        );
      }
    } catch (err: any) {
      if (err instanceof ForbiddenException) throw err;
      return true;
    }

    return true;
  }
}
