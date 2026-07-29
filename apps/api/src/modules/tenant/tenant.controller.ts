import { Controller, Get, Put, Body, Query, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { TenantService } from './tenant.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('resolve')
  async resolveTenant(@Query('slug') slug: string) {
    if (!slug) {
      throw new NotFoundException('Subdomain slug parameter is required.');
    }
    return this.tenantService.getTenantBySlug(slug);
  }

  @Get('current')
  async getCurrentTenant(@Req() req: Request) {
    if (!req.tenant) {
      throw new NotFoundException('No active tenant context resolved for request.');
    }
    return { tenant: req.tenant };
  }

  @Put('current')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('settings:write')
  async updateCurrentTenant(@Req() req: Request, @Body() dto: UpdateTenantDto) {
    const tenantId = (req as any).user?.tenantId || req.tenant?.id;
    if (!tenantId) {
      throw new NotFoundException('Active clinic context required for profile update.');
    }
    const updated = await this.tenantService.updateTenant(tenantId, dto);
    return { message: 'Clinic profile updated successfully.', tenant: updated };
  }
}
