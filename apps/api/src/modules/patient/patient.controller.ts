import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
import { SearchPatientDto } from './dto/search-patient.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { RequireModule } from '../../common/decorators/module.decorator';

@Controller('patients')
@UseGuards(JwtAuthGuard, ModuleGuard, PermissionsGuard)
@RequireModule('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @RequirePermissions('patients:read')
  async searchPatients(@Req() req: Request, @Query() query: SearchPatientDto) {
    const tenantId = (req as any).user.tenantId;
    return this.patientService.searchPatients(tenantId, query);
  }

  @Post()
  @RequirePermissions('patients:create')
  async createPatient(@Req() req: Request, @Body() dto: CreatePatientDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.patientService.createPatient(tenantId, userId, dto);
  }

  @Get(':id')
  @RequirePermissions('patients:read')
  async getPatientById(@Req() req: Request, @Param('id') id: string) {
    const tenantId = (req as any).user.tenantId;
    return this.patientService.getPatientById(tenantId, id);
  }

  @Put(':id')
  @RequirePermissions('patients:write')
  async updatePatient(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdatePatientDto) {
    const tenantId = (req as any).user.tenantId;
    return this.patientService.updatePatient(tenantId, id, dto);
  }

  @Get(':id/timeline')
  @RequirePermissions('patients:read')
  async getPatientTimeline(@Req() req: Request, @Param('id') id: string) {
    const tenantId = (req as any).user.tenantId;
    return this.patientService.getPatientTimeline(tenantId, id);
  }

  @Post(':id/attachments')
  @RequirePermissions('patients:write')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body('category') category?: string
  ) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;

    if (!file) {
      throw new BadRequestException('No file was provided in the upload request.');
    }

    return this.patientService.uploadAttachment(tenantId, id, userId, file, category || 'lab_result');
  }

  @Get(':id/attachments')
  @RequirePermissions('patients:read')
  async getPatientAttachments(@Req() req: Request, @Param('id') id: string) {
    const tenantId = (req as any).user.tenantId;
    return this.patientService.getPatientAttachments(tenantId, id);
  }
}
