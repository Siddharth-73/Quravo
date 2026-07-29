import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('laboratory')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('laboratory')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Get('orders')
  getLabOrders() {
    return this.laboratoryService.findAll();
  }

  @Post('orders/:id/upload')
  uploadResults(@Param('id') id: string, @Body() body: { resultSummary?: string }) {
    return this.laboratoryService.uploadResult(id, body);
  }

  @Get('orders/:id/pdf')
  getReportPdf(@Param('id') id: string) {
    return this.laboratoryService.generatePdfReport(id);
  }
}
