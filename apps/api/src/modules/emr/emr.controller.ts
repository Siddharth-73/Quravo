import { Controller, Get, Post, Put, Body, Param, Req, Query, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { EmrService } from './emr.service';
import { CreateEncounterDto, UpdateEncounterDto } from './dto/create-encounter.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { RequireModule } from '../../common/decorators/module.decorator';

@Controller('emr')
@UseGuards(JwtAuthGuard, ModuleGuard, PermissionsGuard)
@RequireModule('emr')
export class EmrController {
  constructor(private readonly emrService: EmrService) {}

  @Get('encounters')
  @RequirePermissions('emr:read')
  async getEncounters(@Req() req: Request, @Query('patientId') patientId?: string) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    if (patientId) {
      return this.emrService.getPatientEncounters(tenantId, userId, patientId);
    }
    return this.emrService.getAllEncounters(tenantId);
  }

  @Post('encounters')
  @RequirePermissions('emr:write')
  async createEncounter(@Req() req: Request, @Body() dto: CreateEncounterDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.emrService.createEncounter(tenantId, userId, dto);
  }

  @Get('encounters/:id')
  @RequirePermissions('emr:read')
  async getEncounterById(@Req() req: Request, @Param('id') id: string) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.emrService.getEncounterById(tenantId, userId, id);
  }

  @Put('encounters/:id')
  @RequirePermissions('emr:write')
  async updateEncounter(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateEncounterDto
  ) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.emrService.updateEncounter(tenantId, userId, id, dto);
  }

  @Put('encounters/:id/finalize')
  @RequirePermissions('emr:finalize')
  async finalizeEncounter(@Req() req: Request, @Param('id') id: string) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.emrService.finalizeEncounter(tenantId, userId, id);
  }

  @Post('prescriptions')
  @RequirePermissions('emr:write')
  async createPrescription(@Req() req: Request, @Body() dto: CreatePrescriptionDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.emrService.createPrescription(tenantId, userId, dto);
  }

  @Get('patients/:patientId/encounters')
  @RequirePermissions('emr:read')
  async getPatientEncounters(@Req() req: Request, @Param('patientId') patientId: string) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.emrService.getPatientEncounters(tenantId, userId, patientId);
  }
}
