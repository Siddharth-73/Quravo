import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from '../services/payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CreateRazorpayOrderDto, VerifyRazorpayPaymentDto } from '../dto/razorpay.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { ModuleGuard } from '../../../common/guards/module.guard';
import { RequirePermissions } from '../../../common/decorators/permissions.decorator';
import { RequireModule } from '../../../common/decorators/module.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard, ModuleGuard, PermissionsGuard)
@RequireModule('billing')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @RequirePermissions('billing:write')
  async createPayment(@Req() req: Request, @Body() dto: CreatePaymentDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.paymentsService.createPayment(tenantId, userId, dto);
  }

  @Post('razorpay/order')
  @RequirePermissions('billing:write')
  async createRazorpayOrder(@Req() req: Request, @Body() dto: CreateRazorpayOrderDto) {
    const tenantId = (req as any).user.tenantId;
    const userId = (req as any).user.userId;
    return this.paymentsService.createRazorpayOrder(tenantId, userId, dto);
  }

  @Post('razorpay/verify')
  @RequirePermissions('billing:write')
  async verifyRazorpayPayment(@Req() req: Request, @Body() dto: VerifyRazorpayPaymentDto) {
    const tenantId = (req as any).user.tenantId;
    return this.paymentsService.verifyRazorpayPayment(tenantId, dto);
  }
}
