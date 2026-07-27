import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  public readonly emailQueue: Queue;
  public readonly auditQueue: Queue;
  public readonly analyticsQueue: Queue;
  public readonly aiQueue: Queue;
  public readonly exportQueue: Queue;

  public readonly redisConnection: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisConnection = new Redis({
      host: redisHost,
      port: redisPort,
      maxRetriesPerRequest: null,
    });

    this.emailQueue = new Queue('email.queue', { connection: this.redisConnection });
    this.auditQueue = new Queue('audit.queue', { connection: this.redisConnection });
    this.analyticsQueue = new Queue('analytics.queue', { connection: this.redisConnection });
    this.aiQueue = new Queue('ai.queue', { connection: this.redisConnection });
    this.exportQueue = new Queue('export.queue', { connection: this.redisConnection });
  }

  onModuleInit() {}

  async addJob(jobName: string, data: any) {
    return this.emailQueue.add(jobName, data);
  }

  async addAuditJob(jobName: string, data: any) {
    return this.auditQueue.add(jobName, data);
  }

  async addExportJob(jobName: string, data: any) {
    return this.exportQueue.add(jobName, data);
  }

  async addAiJob(jobName: string, data: any) {
    return this.aiQueue.add(jobName, data);
  }

  async addAnalyticsJob<T>(name: string, data: T): Promise<void> {
    await this.analyticsQueue.add(name, data);
  }

  async getRedisStatus(): Promise<boolean> {
    try {
      const ping = await this.redisConnection.ping();
      return ping === 'PONG';
    } catch {
      return false;
    }
  }

  async onModuleDestroy() {
    if (this.emailQueue) await this.emailQueue.close();
    if (this.auditQueue) await this.auditQueue.close();
    if (this.analyticsQueue) await this.analyticsQueue.close();
    if (this.aiQueue) await this.aiQueue.close();
    if (this.exportQueue) await this.exportQueue.close();
    if (this.redisConnection) await this.redisConnection.quit();
  }
}
