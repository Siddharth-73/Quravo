import { Module } from '@nestjs/common';
import { BedManagementController } from './bed-management.controller';

@Module({
  controllers: [BedManagementController],
})
export class BedManagementModule {}
