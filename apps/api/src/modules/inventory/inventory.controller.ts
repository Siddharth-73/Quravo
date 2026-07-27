import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('inventory')
export class InventoryController {
  @Get()
  getInventoryDashboard() {
    return { message: 'Inventory dashboard data' };
  }
}
