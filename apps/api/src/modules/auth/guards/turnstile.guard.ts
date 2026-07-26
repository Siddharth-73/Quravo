import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TurnstileGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secretKey = this.configService.get<string>('TURNSTILE_SECRET_KEY');

    // In dev mode with no key provided, allow request
    if (!secretKey) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.body?.turnstileToken || request.headers['x-turnstile-token'];

    if (!token) {
      throw new HttpException('Cloudflare Turnstile token missing.', HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secretKey, response: token }),
      });

      const outcome = (await response.json()) as { success: boolean };
      if (!outcome.success) {
        throw new HttpException('Turnstile bot verification failed.', HttpStatus.FORBIDDEN);
      }
      return true;
    } catch (err: any) {
      if (err instanceof HttpException) throw err;
      throw new HttpException('Failed to verify bot protection.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
