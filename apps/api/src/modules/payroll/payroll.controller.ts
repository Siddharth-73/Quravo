import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('payroll')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('payroll')
export class PayrollController {
  @Get()
  getPayrollDashboard() {
    return { message: 'Payroll dashboard data' };
  }
}
