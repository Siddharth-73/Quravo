import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('hr')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('hr')
export class HrController {
  @Get()
  getHrDashboard() {
    return { message: 'HR dashboard data' };
  }
}
