import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RealtimeGateway } from './realtime.gateway';

describe('RealtimeGateway Tenant Isolation', () => {
  let gateway: RealtimeGateway;
  let mockServer: any;
  let mockJwtService: any;
  let mockConfigService: any;

  beforeEach(() => {
    mockJwtService = {
      verifyAsync: vi.fn(),
    };
    mockConfigService = {
      get: vi.fn((_key: string, fallback?: any) => fallback),
    };
    gateway = new RealtimeGateway(mockJwtService, mockConfigService);
    mockServer = {
      to: vi.fn().mockReturnThis(),
      emit: vi.fn(),
    };
    gateway.server = mockServer;
  });

  it('should disconnect client if no auth token is provided', async () => {
    const mockClient = {
      id: 'client-1',
      handshake: { headers: {}, auth: {}, query: {} },
      data: {},
      join: vi.fn(),
      disconnect: vi.fn(),
    } as any;

    await gateway.handleConnection(mockClient);

    expect(mockClient.disconnect).toHaveBeenCalled();
    expect(mockClient.join).not.toHaveBeenCalled();
  });

  it('should disconnect client if the auth token is invalid', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

    const mockClient = {
      id: 'client-1',
      handshake: { headers: { authorization: 'Bearer bad-token' }, auth: {}, query: {} },
      data: {},
      join: vi.fn(),
      disconnect: vi.fn(),
    } as any;

    await gateway.handleConnection(mockClient);

    expect(mockClient.disconnect).toHaveBeenCalled();
    expect(mockClient.join).not.toHaveBeenCalled();
  });

  it('should derive tenantId/userId from a verified JWT and join correct rooms', async () => {
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
      join: vi.fn(),
      disconnect: vi.fn(),
    } as any;

    await gateway.handleConnection(mockClient);

    expect(mockClient.disconnect).not.toHaveBeenCalled();
    expect(mockClient.data.tenantId).toBe('tenant-A');
    expect(mockClient.join).toHaveBeenCalledWith([
      'tenant:tenant-A',
      'tenant:tenant-A:branch:branch-X',
      'tenant:tenant-A:user:user-1',
    ]);
  });

  it('should emit appointment status change strictly to the branch room', () => {
    gateway.handleAppointmentStatusChange({ tenantId: 'tenant-A', branchId: 'branch-X' });

    // Emits to branch specifically for queue updates
    expect(mockServer.to).toHaveBeenCalledWith('tenant:tenant-A:branch:branch-X');
    expect(mockServer.emit).toHaveBeenCalledWith('queue.updated', expect.any(Object));

    // Also emits to global tenant for dashboard metrics
    expect(mockServer.to).toHaveBeenCalledWith('tenant:tenant-A');
    expect(mockServer.emit).toHaveBeenCalledWith('dashboard.metrics_updated', expect.any(Object));
  });

  it('should emit notifications specifically to the user room', () => {
    gateway.handleNotificationCreated({ tenantId: 'tenant-A', userId: 'user-1', message: 'Test' });

    expect(mockServer.to).toHaveBeenCalledWith('tenant:tenant-A:user:user-1');
    expect(mockServer.emit).toHaveBeenCalledWith('notification', expect.any(Object));
  });
});
