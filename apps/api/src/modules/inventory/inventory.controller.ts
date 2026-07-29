import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModuleGuard } from '../../common/guards/module.guard';
import { RequireModule } from '../../common/decorators/require-module.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, ModuleGuard)
@RequireModule('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  getInventoryItems() {
    return this.inventoryService.findAll();
  }

  @Post()
  createItem(@Body() body: any) {
    return this.inventoryService.create(body);
  }

  @Patch(':id/stock')
  updateStock(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.inventoryService.updateQuantity(id, body.quantity);
  }
}
