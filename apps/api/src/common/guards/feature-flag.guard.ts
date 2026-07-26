import { Injectable, CanActivate, ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_FLAG_KEY } from '../decorators/feature-flag.decorator';
import { DatabaseService } from '../../database/database.service';
import { featureFlags, eq, and } from '@quravo/db';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly dbService: DatabaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFlag = this.reflector.getAllAndOverride<string>(FEATURE_FLAG_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredFlag) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenant?.id || request.user?.tenantId;

    if (!tenantId) {
      throw new BadRequestException('Cannot verify feature flag: Tenant context missing.');
    }

    const db = this.dbService.db;
    const [flagRecord] = await db
      .select()
      .from(featureFlags)
      .where(and(eq(featureFlags.tenantId, tenantId), eq(featureFlags.flagKey, requiredFlag)))
      .limit(1);

    if (!flagRecord || !flagRecord.enabled) {
      throw new ForbiddenException(
        `Feature flag '${requiredFlag}' is not enabled for your clinic.`
      );
    }

    return true;
  }
}
