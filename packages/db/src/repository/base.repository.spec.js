"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const base_repository_1 = require("./base.repository");
const tenants_1 = require("../schema/tenants");
class MockTenantRepository extends base_repository_1.BaseTenantRepository {
    constructor(db) {
        super(db, tenants_1.tenants, tenants_1.tenants.id);
    }
    testTenantFilter(tenantId) {
        return this.withTenant(tenantId);
    }
}
(0, vitest_1.describe)('BaseTenantRepository (Tenant Isolation Unit Test)', () => {
    const mockDb = {};
    const repository = new MockTenantRepository(mockDb);
    (0, vitest_1.it)('should successfully build tenant filter condition when valid tenantId is provided', () => {
        const validTenantId = '123e4567-e89b-12d3-a456-426614174000';
        const condition = repository.testTenantFilter(validTenantId);
        (0, vitest_1.expect)(condition).toBeDefined();
    });
    (0, vitest_1.it)('should throw Tenant Context Violation error when tenantId is empty or undefined', () => {
        (0, vitest_1.expect)(() => repository.testTenantFilter('')).toThrow('Tenant Context Violation: tenantId is required for tenant-scoped operations.');
    });
});
