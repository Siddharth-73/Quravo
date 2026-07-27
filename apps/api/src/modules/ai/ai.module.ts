import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from '../../providers/ai/ai.service';
import { QueueModule } from '../../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
