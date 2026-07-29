import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('pharmacy')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('orders')
  getOrders() {
    return this.pharmacyService.findAll();
  }

  @Post('dispense/:id')
  dispenseMedication(@Param('id') id: string) {
    return this.pharmacyService.dispense(id);
  }
}
