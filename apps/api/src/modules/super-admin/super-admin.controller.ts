import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { ProvisionTenantDto } from './dto/provision-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';

@Controller('super-admin')
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
