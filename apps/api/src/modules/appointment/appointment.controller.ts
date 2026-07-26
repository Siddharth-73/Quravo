import { Controller, Get, Post, Put, Body, Param, Query, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateWalkInDto } from './dto/walk-in.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { RequireModule } from '../../common/decorators/module.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard, ModuleGuard, PermissionsGuard)
@RequireModule('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  @RequirePermissions('appointments:read')
  async getCalendar(
    @Req() req: Request,
    @Query('branchId') branchId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('doctorId') doctorId?: string
  ) {
    const tenantId = (req as any).user.tenantId;
    return this.appointmentService.getAppointmentsCalendar(tenantId, branchId, startDate, endDate, doctorId);
  }

  @Post()
  @RequirePermissions('appointments:create')
  async createAppointment(@Req() req: Request, @Body() dto: CreateAppointmentDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.appointmentService.createAppointment(tenantId, userId, dto);
  }

  @Post('walk-in')
  @RequirePermissions('appointments:create')
  async createWalkIn(@Req() req: Request, @Body() dto: CreateWalkInDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.appointmentService.createWalkIn(tenantId, userId, dto);
  }

  @Put(':id/status')
  @RequirePermissions('appointments:write')
  async updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto
  ) {
    const tenantId = (req as any).user.tenantId;
    return this.appointmentService.updateStatus(tenantId, id, dto);
  }

  @Get('queue/live')
  @RequirePermissions('appointments:read')
  async getLiveQueue(@Req() req: Request, @Query('branchId') branchId: string) {
    const tenantId = (req as any).user.tenantId;
    if (!branchId) throw new NotFoundException('Branch ID parameter is required.');
    return this.appointmentService.getLiveQueue(tenantId, branchId);
  }
}
