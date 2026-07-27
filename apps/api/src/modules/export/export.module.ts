import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { QueueModule } from '../../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [ExportController],
  providers: [],
})
export class ExportModule {}
