"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const realtime_gateway_1 = require("./realtime.gateway");
(0, vitest_1.describe)('RealtimeGateway Tenant Isolation', () => {
    let gateway;
    let mockServer;
    let mockJwtService;
    let mockConfigService;
    (0, vitest_1.beforeEach)(() => {
        mockJwtService = {
            verifyAsync: vitest_1.vi.fn(),
        };
        mockConfigService = {
            get: vitest_1.vi.fn((_key, fallback) => fallback),
        };
        gateway = new realtime_gateway_1.RealtimeGateway(mockJwtService, mockConfigService);
        mockServer = {
            to: vitest_1.vi.fn().mockReturnThis(),
            emit: vitest_1.vi.fn(),
        };
        gateway.server = mockServer;
    });
    (0, vitest_1.it)('should disconnect client if no auth token is provided', async () => {
        const mockClient = {
            id: 'client-1',
            handshake: { headers: {}, auth: {}, query: {} },
            data: {},
            join: vitest_1.vi.fn(),
            disconnect: vitest_1.vi.fn(),
        };
        await gateway.handleConnection(mockClient);
        (0, vitest_1.expect)(mockClient.disconnect).toHaveBeenCalled();
        (0, vitest_1.expect)(mockClient.join).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should disconnect client if the auth token is invalid', async () => {
        mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));
        const mockClient = {
            id: 'client-1',
            handshake: { headers: { authorization: 'Bearer bad-token' }, auth: {}, query: {} },
            data: {},
            join: vitest_1.vi.fn(),
            disconnect: vitest_1.vi.fn(),
        };
        await gateway.handleConnection(mockClient);
        (0, vitest_1.expect)(mockClient.disconnect).toHaveBeenCalled();
        (0, vitest_1.expect)(mockClient.join).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should derive tenantId/userId from a verified JWT and join correct rooms', async () => {
        mockJwtService.verifyAsync.mockResolvedValue({
            sub: 'user-1',
            email: 'user@example.com',
            tenantId: 'tenant-A',
            role: 'owner',
        });
        const mockClient = {
            id: 'client-1',
            handshake: {
                headers: { authorization: 'Bearer good-token' },
                auth: {},
                query: { branchId: 'branch-X' },
            },
            data: {},
            join: vitest_1.vi.fn(),
            disconnect: vitest_1.vi.fn(),
        };
        await gateway.handleConnection(mockClient);
        (0, vitest_1.expect)(mockClient.disconnect).not.toHaveBeenCalled();
        (0, vitest_1.expect)(mockClient.data.tenantId).toBe('tenant-A');
        (0, vitest_1.expect)(mockClient.join).toHaveBeenCalledWith([
            'tenant:tenant-A',
            'tenant:tenant-A:branch:branch-X',
            'tenant:tenant-A:user:user-1',
        ]);
    });
    (0, vitest_1.it)('should emit appointment status change strictly to the branch room', () => {
        gateway.handleAppointmentStatusChange({ tenantId: 'tenant-A', branchId: 'branch-X' });
        // Emits to branch specifically for queue updates
        (0, vitest_1.expect)(mockServer.to).toHaveBeenCalledWith('tenant:tenant-A:branch:branch-X');
        (0, vitest_1.expect)(mockServer.emit).toHaveBeenCalledWith('queue.updated', vitest_1.expect.any(Object));
        // Also emits to global tenant for dashboard metrics
        (0, vitest_1.expect)(mockServer.to).toHaveBeenCalledWith('tenant:tenant-A');
        (0, vitest_1.expect)(mockServer.emit).toHaveBeenCalledWith('dashboard.metrics_updated', vitest_1.expect.any(Object));
    });
    (0, vitest_1.it)('should emit notifications specifically to the user room', () => {
        gateway.handleNotificationCreated({ tenantId: 'tenant-A', userId: 'user-1', message: 'Test' });
        (0, vitest_1.expect)(mockServer.to).toHaveBeenCalledWith('tenant:tenant-A:user:user-1');
        (0, vitest_1.expect)(mockServer.emit).toHaveBeenCalledWith('notification', vitest_1.expect.any(Object));
    });
});
