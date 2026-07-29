"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const tenant_repository_1 = require("./tenant-repository");
(0, vitest_1.describe)('TenantRepository Row-Level Data Isolation (Phase 3 Unit Test)', () => {
    const mockDb = {
        select: vitest_1.vi.fn().mockReturnThis(),
        from: vitest_1.vi.fn().mockReturnThis(),
        where: vitest_1.vi.fn().mockReturnValue([{ id: 'rec-1', tenantId: 'tenant-100' }]),
        insert: vitest_1.vi.fn().mockReturnThis(),
        values: vitest_1.vi.fn().mockReturnThis(),
        returning: vitest_1.vi.fn().mockReturnValue([{ id: 'rec-1', tenantId: 'tenant-100', name: 'Test' }]),
    };
    const mockTable = {};
    const mockTenantColumn = {};
    const repository = new tenant_repository_1.TenantRepository(mockDb, mockTable, mockTenantColumn);
    (0, vitest_1.it)('should prevent insert operations without a valid tenantId', async () => {
        await (0, vitest_1.expect)(repository.insert('', { name: 'Unauthorized Record' })).rejects.toThrow('Tenant Context Violation: Cannot insert record without tenantId.');
    });
    (0, vitest_1.it)('should auto-append tenantId to record insertions for mandatory tenant scoping', async () => {
        const tenantId = 'tenant-100';
        const result = await repository.insert(tenantId, { name: 'Test Record' });
        (0, vitest_1.expect)(result).toBeDefined();
        (0, vitest_1.expect)(mockDb.insert).toHaveBeenCalled();
    });
});
