import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { ProvisionTenantDto } from './dto/provision-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { CreateClinicListingDto } from './dto/create-clinic-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('list-clinic-request')
  async createClinicListing(@Body() dto: CreateClinicListingDto) {
    return this.superAdminService.createClinicListing(dto);
  }

  @Get('clinic-listings')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async getClinicListings() {
    return this.superAdminService.getClinicListings();
  }

  @Post('tenants')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async provisionTenant(@Body() dto: ProvisionTenantDto) {
    return this.superAdminService.provisionTenant(dto);
  }

  @Get('tenants')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async listTenants() {
    return this.superAdminService.listTenants();
  }

  @Get('tenants/:id/config')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async getTenantConfig(@Param('id') id: string) {
    return this.superAdminService.getTenantConfig(id);
  }

  @Put('tenants/:id/config')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async updateTenantConfig(@Param('id') id: string, @Body() dto: UpdateTenantConfigDto) {
    return this.superAdminService.updateTenantConfig(id, dto);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async getDashboard() {
    return this.superAdminService.getDashboardData();
  }

  @Post('tenants/:id/suspend')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async suspendTenant(@Param('id') id: string) {
    return this.superAdminService.suspendTenant(id);
  }

  @Post('tenants/:id/reactivate')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async reactivateTenant(@Param('id') id: string) {
    return this.superAdminService.reactivateTenant(id);
  }

  @Post('tenants/:id/archive')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async archiveTenant(@Param('id') id: string) {
    return this.superAdminService.archiveTenant(id);
  }

  @Post('tenants/:id/reset-settings')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async resetTenantSettings(@Param('id') id: string) {
    return this.superAdminService.resetTenantSettings(id);
  }

  @Post('tenants/:id/reset-branding')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async resetTenantBranding(@Param('id') id: string) {
    return this.superAdminService.resetTenantBranding(id);
  }

  @Post('tenants/:id/clear-cache')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async clearTenantCache(@Param('id') id: string) {
    return this.superAdminService.clearTenantCache(id);
  }

  @Get('feature-flags')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async getFeatureFlags() {
    return this.superAdminService.getFeatureFlags();
  }

  @Get('audit-logs')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async getAuditLogs() {
    return this.superAdminService.getAuditLogs();
  }

  @Get('mail-logs')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async getMailLogs() {
    return this.superAdminService.getMailLogs();
  }

  @Get('health')
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  async getHealthStatus() {
    return this.superAdminService.getHealthStatus();
  }
}
