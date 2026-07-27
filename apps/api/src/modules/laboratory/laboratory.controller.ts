import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('laboratory')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('laboratory')
export class LaboratoryController {
  @Get()
  getLaboratoryDashboard() {
    return { message: 'Laboratory dashboard data' };
  }
}
