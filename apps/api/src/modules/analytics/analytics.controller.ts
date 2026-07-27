import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { ModuleGuard } from '../../../common/guards/module.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { RequireModule } from '../../../common/decorators/module.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, ModuleGuard, PermissionsGuard)
@RequireModule('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @RequirePermissions('analytics:read')
  async getDashboardSummary(
    @Req() req: Request,
    @Query('branchId') branchId?: string,
    @Query('date') targetDate?: string
  ) {
    const tenantId = (req as any).user.tenantId;
    return this.analyticsService.getDailySummary(tenantId, branchId, targetDate);
  }
}
