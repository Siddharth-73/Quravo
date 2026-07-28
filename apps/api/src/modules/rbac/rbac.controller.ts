import { Controller, Get, Post, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { RbacService } from './rbac.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@Controller('rbac')
@SkipThrottle()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('modules')
  async getModules(@Req() req: Request) {
    const tenantId = (req as any).user.tenantId;
    return this.rbacService.getTenantModules(tenantId);
  }

  @Post('modules/toggle')
  @RequirePermissions('roles:write')
  async toggleModule(
    @Req() req: Request,
    @Body() body: { moduleKey: string; enabled: boolean }
  ) {
    const tenantId = (req as any).user.tenantId;
    return this.rbacService.toggleTenantModule(tenantId, body.moduleKey, body.enabled);
  }

  @Get('roles')
  async getRoles(@Req() req: Request) {
    const tenantId = (req as any).user.tenantId;
    return this.rbacService.getTenantRoles(tenantId);
  }

  @Post('roles')
  @RequirePermissions('roles:write')
  async createRole(
    @Req() req: Request,
    @Body() body: { name: string; description: string; permissions: string[] }
  ) {
    const tenantId = (req as any).user.tenantId;
    return this.rbacService.createRole(tenantId, body.name, body.description, body.permissions);
  }

  @Put('roles/:roleName/permissions')
  @RequirePermissions('roles:write')
  async updateRolePermissions(
    @Req() req: Request,
    @Param('roleName') roleName: string,
    @Body() body: { permissions: string[] }
  ) {
    const tenantId = (req as any).user.tenantId;
    return this.rbacService.updateRolePermissions(tenantId, roleName, body.permissions);
  }
}
