import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';
import { DatabaseService } from '../database/database.service';
import { QueueService } from '../queue/queue.service';
import { sql } from '@quravo/db';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dbService: DatabaseService,
    private queueService: QueueService
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => {
        try {
          await this.dbService.db.execute(sql`SELECT 1`);
          return { database: { status: 'up' } };
        } catch (err: any) {
          return { database: { status: 'down', message: err.message } };
        }
      },
      async (): Promise<HealthIndicatorResult> => {
        const isRedisUp = await this.queueService.getRedisStatus();
        return { redis: { status: isRedisUp ? 'up' : 'down' } };
      },
    ]);
  }
}
