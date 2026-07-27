import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('bed-management')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('bed-management')
export class BedManagementController {
  @Get()
  getBedManagementDashboard() {
    return { message: 'Bed Management dashboard data' };
  }
}
