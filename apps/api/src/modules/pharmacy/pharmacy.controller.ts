import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('pharmacy')
export class PharmacyController {
  @Get()
  getPharmacyDashboard() {
    return { message: 'Pharmacy dashboard data' };
  }
}
