import { Controller, Get, Post, Put, Body, Param, Req, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { ClinicService } from './clinic.service';
import { UpdateBrandingDto } from './dto/branding.dto';
import { CreateBranchDto, UpdateWorkingHoursDto } from './dto/branch.dto';
import { InviteStaffDto, AcceptInviteDto } from './dto/invite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@Controller('clinic')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get('public/branding')
  async getPublicBranding(@Req() req: Request) {
    const tenantId = req.tenant?.id;
    if (!tenantId) throw new NotFoundException('Clinic subdomain context missing.');
    return this.clinicService.getBranding(tenantId);
  }

  @Get('branding')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getBranding(@Req() req: Request) {
    const tenantId = (req as any).user.tenantId;
    return this.clinicService.getBranding(tenantId);
  }

  @Put('branding')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clinic:write')
  async updateBranding(@Req() req: Request, @Body() dto: UpdateBrandingDto) {
    const tenantId = (req as any).user.tenantId;
    return this.clinicService.updateBranding(tenantId, dto);
  }

  @Get('branches')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getBranches(@Req() req: Request) {
    const tenantId = (req as any).user.tenantId;
    return this.clinicService.getBranches(tenantId);
  }

  @Post('branches')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clinic:write')
  async createBranch(@Req() req: Request, @Body() dto: CreateBranchDto) {
    const tenantId = (req as any).user.tenantId;
    return this.clinicService.createBranch(tenantId, dto);
  }

  @Get('branches/:branchId/hours')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async getWorkingHours(@Req() req: Request, @Param('branchId') branchId: string) {
    const tenantId = (req as any).user.tenantId;
    return this.clinicService.getWorkingHours(tenantId, branchId);
  }

  @Put('branches/:branchId/hours')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clinic:write')
  async updateWorkingHours(
    @Req() req: Request,
    @Param('branchId') branchId: string,
    @Body() dto: UpdateWorkingHoursDto
  ) {
    const tenantId = (req as any).user.tenantId;
    return this.clinicService.updateWorkingHours(tenantId, branchId, dto);
  }

  @Post('staff/invite')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('users:write')
  async inviteStaff(@Req() req: Request, @Body() dto: InviteStaffDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.clinicService.inviteStaff(tenantId, userId, dto);
  }

  @Post('staff/accept-invite')
  async acceptInvite(@Body() dto: AcceptInviteDto) {
    return this.clinicService.acceptInvite(dto);
  }
}
