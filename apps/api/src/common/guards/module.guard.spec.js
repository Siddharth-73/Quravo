"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_guard_1 = require("./module.guard");
const common_1 = require("@nestjs/common");
const vitest_1 = require("vitest");
const db_1 = require("@quravo/db");
vitest_1.vi.mock('@quravo/db', () => ({
    db: {
        query: {
            tenants: {
                findFirst: vitest_1.vi.fn(),
            }
        }
    },
    eq: vitest_1.vi.fn(),
    tenants: { id: 'tenantId' }
}));
(0, vitest_1.describe)('ModuleGuard', () => {
    let guard;
    let reflectorMock;
    (0, vitest_1.beforeEach)(() => {
        reflectorMock = {
            getAllAndOverride: vitest_1.vi.fn(),
        };
        guard = new module_guard_1.ModuleGuard(reflectorMock);
    });
    const createMockContext = (user) => ({
        getHandler: vitest_1.vi.fn(),
        getClass: vitest_1.vi.fn(),
        switchToHttp: () => ({
            getRequest: () => ({ user }),
        }),
    });
    (0, vitest_1.it)('should allow access if no module is required', async () => {
        reflectorMock.getAllAndOverride.mockReturnValue(undefined);
        const context = createMockContext({ tenantId: 't1' });
        const result = await guard.canActivate(context);
        (0, vitest_1.expect)(result).toBe(true);
    });
    (0, vitest_1.it)('should deny access if user has no tenantId', async () => {
        reflectorMock.getAllAndOverride.mockReturnValue('pharmacy');
        const context = createMockContext({ userId: 'u1' }); // missing tenantId
        await (0, vitest_1.expect)(guard.canActivate(context)).rejects.toThrow(common_1.ForbiddenException);
    });
    (0, vitest_1.it)('should deny access if tenant does not have the module enabled', async () => {
        reflectorMock.getAllAndOverride.mockReturnValue('pharmacy');
        db_1.db.query.tenants.findFirst.mockResolvedValue({
            id: 't1',
            enabledModules: ['laboratory', 'inventory'],
        });
        const context = createMockContext({ tenantId: 't1' });
        await (0, vitest_1.expect)(guard.canActivate(context)).rejects.toThrow(/does not include access to the 'pharmacy' module/);
    });
    (0, vitest_1.it)('should allow access if tenant has the module enabled', async () => {
        reflectorMock.getAllAndOverride.mockReturnValue('pharmacy');
        db_1.db.query.tenants.findFirst.mockResolvedValue({
            id: 't1',
            enabledModules: ['pharmacy', 'laboratory'],
        });
        const context = createMockContext({ tenantId: 't1' });
        const result = await guard.canActivate(context);
        (0, vitest_1.expect)(result).toBe(true);
    });
});
