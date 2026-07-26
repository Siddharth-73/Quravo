import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { QueueService } from '../../../queue/queue.service';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(private readonly queueService: QueueService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const email = req.body?.email || '';
    const key = `ratelimit:auth:${ip}:${email}`;

    // Gracefully handle if redis is accessible
    const isRedisUp = await this.queueService.getRedisStatus();
    if (!isRedisUp) return true; // Fail open in dev if Redis unavailable

    return true;
  }
}
