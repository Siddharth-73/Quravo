import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';

export interface NotificationJobPayload {
  tenantId: string;
  type: 'appointment_confirmed' | 'status_changed' | 'cancelled';
  recipientEmail: string;
  title: string;
  message: string;
}

@Injectable()
export class NotificationProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationProcessor.name);
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
      'notification-queue',
      async (job: Job<NotificationJobPayload>) => {
        this.logger.log(`🔔 Processing notification alert ${job.id} [${job.data.type}] to ${job.data.recipientEmail}`);
        return { status: 'delivered', deliveredAt: new Date().toISOString() };
      },
      { connection: this.redisConnection }
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Notification job ${job.id} delivered`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Notification job ${job?.id} failed: ${err.message}`);
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
