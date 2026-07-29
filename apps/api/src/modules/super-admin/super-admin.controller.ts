import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { ProvisionTenantDto } from './dto/provision-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Controller('super-admin')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('tenants')
  async provisionTenant(@Body() dto: ProvisionTenantDto) {
    return this.superAdminService.provisionTenant(dto);
  }

  @Get('tenants')
  async listTenants() {
    return this.superAdminService.listTenants();
  }

  @Get('tenants/:id/config')
  async getTenantConfig(@Param('id') id: string) {
    return this.superAdminService.getTenantConfig(id);
  }

  @Put('tenants/:id/config')
  async updateTenantConfig(@Param('id') id: string, @Body() dto: UpdateTenantConfigDto) {
    return this.superAdminService.updateTenantConfig(id, dto);
  }
}
