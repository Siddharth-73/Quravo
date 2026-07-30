import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private inMemoryStore: RateLimitStore = {};
  private readonly limit = 100; // requests
  private readonly windowMs = 60 * 1000; // 1 minute

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.headers['x-forwarded-for'] || '127.0.0.1';
    const key = `ratelimit:${ip}`;

    const upstashUrl = this.configService.get<string>('UPSTASH_REDIS_REST_URL');
    const upstashToken = this.configService.get<string>('UPSTASH_REDIS_REST_TOKEN');

    if (upstashUrl && upstashToken) {
      try {
        const response = await fetch(`${upstashUrl}/pipeline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${upstashToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            ['INCR', key],
            ['EXPIRE', key, 60],
          ]),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const currentCount = data?.[0]?.result || 1;

          if (currentCount > this.limit) {
            throw new HttpException(
              {
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: 'Rate limit exceeded. Please try again later.',
                error: 'Too Many Requests',
              },
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }
          return true;
        }
      } catch (err) {
        if (err instanceof HttpException) throw err;
        // Fallback to in-memory if network error occurs
      }
    }

    // In-memory rate limiting fallback
    const now = Date.now();
    const record = this.inMemoryStore[key];

    if (!record || now > record.resetTime) {
      this.inMemoryStore[key] = { count: 1, resetTime: now + this.windowMs };
      return true;
    }

    record.count += 1;
    if (record.count > this.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded. Please try again later.',
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
