import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_KEY } from '../decorators/module.decorator';
import { TenantCacheService } from '../../modules/tenant/tenant-cache.service';
import { ModuleKey } from '@quravo/common';

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantCacheService: TenantCacheService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.getAllAndOverride<ModuleKey>(MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredModule) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenant?.id || request.user?.tenantId;

    if (!tenantId) {
      throw new BadRequestException('Cannot verify module enablement: Tenant context missing.');
    }

    // Fetch cached enabled modules map from Redis
    const enabledModules = await this.tenantCacheService.getEnabledModules(tenantId);

    // If module key is explicitly false, reject request
    const isEnabled = enabledModules[requiredModule] !== false;

    if (!isEnabled) {
      throw new ForbiddenException(
        `Feature module '${requiredModule}' is not enabled for your clinic plan tier or subscription.`
      );
    }

    return true;
  }
}
