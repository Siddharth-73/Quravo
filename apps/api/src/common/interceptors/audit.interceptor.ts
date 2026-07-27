import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { QueueService } from '../../queue/queue.service';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly queueService: QueueService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // We only want to log mutations (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      const user = (request as any).user;
      
      if (user) {
        // Scrub sensitive fields before sending to queue
        const sanitizedBody = this.sanitizePayload(request.body);

        // Dispatch audit log to background worker
        this.queueService.addAuditJob('log-audit-event', {
          tenantId: user.tenantId,
          userId: user.userId,
          action: `${request.method} ${request.route.path}`,
          entity: this.extractEntity(request.route.path),
          entityId: request.params.id || null,
          details: sanitizedBody,
        }).catch(err => console.error('Failed to dispatch audit log:', err));
      }
    }

    return next.handle();
  }

  private sanitizePayload(body: any): any {
    if (!body) return {};
    const sanitized = { ...body };
    const sensitiveKeys = ['password', 'token', 'secret', 'creditCard'];
    
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    return sanitized;
  }

  private extractEntity(path: string): string {
    const parts = path.split('/').filter(p => p && !p.startsWith(':'));
    return parts.length > 2 ? parts[2] : 'system';
  }
}
