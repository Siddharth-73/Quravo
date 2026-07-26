import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private redisConnection!: Redis;
  private defaultQueue!: Queue;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisConnection = new Redis({
      host,
      port,
      maxRetriesPerRequest: null,
    });

    this.defaultQueue = new Queue('default-queue', {
      connection: this.redisConnection,
    });
  }

  async addJob<T>(name: string, data: T): Promise<void> {
    await this.defaultQueue.add(name, data);
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
    if (this.defaultQueue) {
      await this.defaultQueue.close();
    }
    if (this.redisConnection) {
      await this.redisConnection.quit();
    }
  }
}
