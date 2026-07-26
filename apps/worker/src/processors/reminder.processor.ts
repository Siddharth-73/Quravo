import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';

export interface ReminderJobPayload {
  appointmentId: string;
  tenantId: string;
  patientEmail: string;
  patientName: string;
  doctorName: string;
  startTime: string;
  branchName: string;
}

@Injectable()
export class ReminderProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReminderProcessor.name);
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
      'reminder-queue',
      async (job: Job<ReminderJobPayload>) => {
        this.logger.log(`⏰ Processing pre-appointment reminder ${job.id} for ${job.data.patientName}`);
        // Reminder dispatch execution (e.g. Email or SMS)
        return { status: 'sent', dispatchedAt: new Date().toISOString() };
      },
      { connection: this.redisConnection }
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Reminder job ${job.id} dispatched successfully`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Reminder job ${job?.id} failed: ${err.message}`);
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
