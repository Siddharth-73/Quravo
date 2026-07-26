import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { TenantCacheService } from '../../modules/tenant/tenant-cache.service';
import { hasAllPermissions } from '@quravo/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantCacheService: TenantCacheService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId || !user.role) {
      throw new UnauthorizedException('Authentication credentials or active tenant role missing.');
    }

    // Owner role has implicit superadmin wildcard
    if (user.role === 'owner') {
      return true;
    }

    // Fetch cached permissions from Redis
    const grantedPermissions = await this.tenantCacheService.getRolePermissions(user.tenantId, user.role);

    const isAllowed = hasAllPermissions(grantedPermissions, requiredPermissions);

    if (!isAllowed) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`
      );
    }

    return true;
  }
}
