import { describe, it, expect, vi } from 'vitest';
import { BaseTenantRepository } from './base.repository';
import { tenants } from '../schema/tenants';

class MockTenantRepository extends BaseTenantRepository<any> {
  constructor(db: any) {
    super(db, tenants, tenants.id);
  }

  public testTenantFilter(tenantId: string) {
    return this.withTenant(tenantId);
  }
}

describe('BaseTenantRepository (Tenant Isolation Unit Test)', () => {
  const mockDb = {} as any;
  const repository = new MockTenantRepository(mockDb);

  it('should successfully build tenant filter condition when valid tenantId is provided', () => {
    const validTenantId = '123e4567-e89b-12d3-a456-426614174000';
    const condition = repository.testTenantFilter(validTenantId);
    expect(condition).toBeDefined();
  });

  it('should throw Tenant Context Violation error when tenantId is empty or undefined', () => {
    expect(() => repository.testTenantFilter('')).toThrow(
      'Tenant Context Violation: tenantId is required for tenant-scoped operations.'
    );
  });
});
