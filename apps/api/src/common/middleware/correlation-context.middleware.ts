import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from '@quravo/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CorrelationContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    const tenantId = req.headers['x-tenant-id'] as string | undefined;
    const userId = req.headers['x-user-id'] as string | undefined;

    // Attach request ID to response header for client trace
    res.setHeader('x-request-id', requestId);

    RequestContext.run({ requestId, tenantId, userId }, () => {
      next();
    });
  }
}
