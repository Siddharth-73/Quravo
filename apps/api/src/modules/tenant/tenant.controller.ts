import { Controller, Get, Query, Req, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { TenantService } from './tenant.service';

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
}
