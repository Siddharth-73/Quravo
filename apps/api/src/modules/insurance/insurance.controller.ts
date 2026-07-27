import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('insurance')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('insurance')
export class InsuranceController {
  @Get()
  getInsuranceDashboard() {
    return { message: 'Insurance dashboard data' };
  }
}
