import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class DefaultProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DefaultProcessor.name);
  private worker!: Worker;
  private redisConnection!: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisConnection = new Redis({
      host,
      port,
      maxRetriesPerRequest: null,
    });

    this.worker = new Worker(
      'default-queue',
      async (job: Job) => {
        this.logger.log(`Processing job ${job.id} [${job.name}]`);
        // Job handler processing logic
        return { status: 'completed', processedAt: new Date().toISOString() };
      },
      { connection: this.redisConnection }
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
    });
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.close();
    }
    if (this.redisConnection) {
      await this.redisConnection.quit();
    }
  }
}
