import { Module } from '@nestjs/common';
import { LaboratoryController } from './laboratory.controller';

@Module({
  controllers: [LaboratoryController],
})
export class LaboratoryModule {}
