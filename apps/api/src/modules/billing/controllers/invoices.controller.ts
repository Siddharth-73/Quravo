import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { InvoicesService } from '../services/invoices.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { ModuleGuard } from '../../../common/guards/module.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { RequireModule } from '../../../common/decorators/module.decorator';

@Controller('invoices')
@UseGuards(JwtAuthGuard, ModuleGuard, PermissionsGuard)
@RequireModule('billing')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @RequirePermissions('billing:read')
  async listInvoices(@Req() req: Request) {
    const tenantId = (req as any).user.tenantId;
    return this.invoicesService.listInvoices(tenantId);
  }

  @Get(':id')
  @RequirePermissions('billing:read')
  async getInvoice(@Req() req: Request, @Param('id') id: string) {
    const tenantId = (req as any).user.tenantId;
    return this.invoicesService.getInvoice(tenantId, id);
  }

  @Post()
  @RequirePermissions('billing:create')
  async createInvoice(@Req() req: Request, @Body() dto: CreateInvoiceDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.invoicesService.createInvoice(tenantId, userId, dto);
  }
}
