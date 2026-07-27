import { ModuleGuard } from './module.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { db } from '@quravo/db';

vi.mock('@quravo/db', () => ({
  db: {
    query: {
      tenants: {
        findFirst: vi.fn(),
      }
    }
  },
  eq: vi.fn(),
  tenants: { id: 'tenantId' }
}));

describe('ModuleGuard', () => {
  let guard: ModuleGuard;
  let reflectorMock: any;

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: vi.fn(),
    };
    guard = new ModuleGuard(reflectorMock as any);
  });

  const createMockContext = (user: any) => ({
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext);

  it('should allow access if no module is required', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue(undefined);
    
    const context = createMockContext({ tenantId: 't1' });
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });

  it('should deny access if user has no tenantId', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue('pharmacy');
    
    const context = createMockContext({ userId: 'u1' }); // missing tenantId
    
    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should deny access if tenant does not have the module enabled', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue('pharmacy');
    
    (db.query.tenants.findFirst as any).mockResolvedValue({
      id: 't1',
      enabledModules: ['laboratory', 'inventory'],
    });

    const context = createMockContext({ tenantId: 't1' });
    
    await expect(guard.canActivate(context)).rejects.toThrow(/does not include access to the 'pharmacy' module/);
  });

  it('should allow access if tenant has the module enabled', async () => {
    reflectorMock.getAllAndOverride.mockReturnValue('pharmacy');
    
    (db.query.tenants.findFirst as any).mockResolvedValue({
      id: 't1',
      enabledModules: ['pharmacy', 'laboratory'],
    });

    const context = createMockContext({ tenantId: 't1' });
    const result = await guard.canActivate(context);
    
    expect(result).toBe(true);
  });
});
