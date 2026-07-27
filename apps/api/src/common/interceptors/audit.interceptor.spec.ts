import { AuditInterceptor } from './audit.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueueService } from '../../queue/queue.service';
import { of } from 'rxjs';

describe('AuditInterceptor', () => {
  let interceptor: AuditInterceptor;
  let queueServiceMock: any;

  beforeEach(() => {
    queueServiceMock = {
      addAuditJob: vi.fn().mockResolvedValue(true),
    };
    interceptor = new AuditInterceptor(queueServiceMock as any);
  });

  const createMockContext = (method: string, path: string, body: any, user: any) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          method,
          route: { path },
          params: { id: '123' },
          body,
          user,
        }),
      }),
    } as ExecutionContext;
  };

  const mockCallHandler = {
    handle: () => of('next-handled'),
  } as CallHandler;

  it('should ignore GET requests', () => {
    const context = createMockContext('GET', '/api/v1/patients', {}, { tenantId: 't1', userId: 'u1' });
    interceptor.intercept(context, mockCallHandler);
    expect(queueServiceMock.addAuditJob).not.toHaveBeenCalled();
  });

  it('should intercept POST requests and log audit event', () => {
    const context = createMockContext('POST', '/api/v1/patients', { name: 'John' }, { tenantId: 't1', userId: 'u1' });
    interceptor.intercept(context, mockCallHandler);
    
    expect(queueServiceMock.addAuditJob).toHaveBeenCalledWith('log-audit-event', expect.objectContaining({
      tenantId: 't1',
      userId: 'u1',
      action: 'POST /api/v1/patients',
      entity: 'patients',
    }));
  });

  it('should sanitize passwords in request body', () => {
    const context = createMockContext('POST', '/api/v1/users', { username: 'test', password: 'secretpassword' }, { tenantId: 't1', userId: 'u1' });
    interceptor.intercept(context, mockCallHandler);
    
    expect(queueServiceMock.addAuditJob).toHaveBeenCalledWith('log-audit-event', expect.objectContaining({
      details: {
        username: 'test',
        password: '[REDACTED]'
      }
    }));
  });
});
