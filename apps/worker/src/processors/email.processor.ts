import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { EmailJobPayload } from '@quravo/common';
import { EmailProvider } from '../providers/email.provider';

@Injectable()
export class EmailProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailProcessor.name);
  private worker!: Worker;
  private redisConnection!: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailProvider: EmailProvider
  ) {}

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
      async (job: Job<EmailJobPayload>) => {
        this.logger.log(`Processing email job ${job.id} [${job.name}]`);
        await this.emailProvider.sendEmail(job.data);
        return { status: 'sent', sentAt: new Date().toISOString() };
      },
      { connection: this.redisConnection }
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Email job ${job.id} dispatched successfully`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Email job ${job?.id} failed with error: ${err.message}`);
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
