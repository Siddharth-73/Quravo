import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('procurement')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('procurement')
export class ProcurementController {
  @Get()
  getProcurementDashboard() {
    return { message: 'Procurement dashboard data' };
  }
}
