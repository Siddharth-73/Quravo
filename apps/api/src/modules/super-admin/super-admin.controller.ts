import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SeedService } from '../../database/seed.service';
import { ProvisionTenantDto } from './dto/provision-tenant.dto';
import { UpdateTenantConfigDto } from './dto/update-tenant-config.dto';
import { CreateClinicListingDto } from './dto/create-clinic-listing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuperAdminGuard } from './guards/super-admin.guard';

@Controller('super-admin')
export class SuperAdminController {
  constructor(
    private readonly superAdminService: SuperAdminService,
    private readonly seedService: SeedService
  ) {}

  @Post('seed')
  async triggerSeed() {
    return this.seedService.seedDatabase();
  }

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
}
