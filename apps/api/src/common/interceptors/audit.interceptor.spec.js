"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audit_interceptor_1 = require("./audit.interceptor");
const vitest_1 = require("vitest");
const rxjs_1 = require("rxjs");
(0, vitest_1.describe)('AuditInterceptor', () => {
    let interceptor;
    let queueServiceMock;
    (0, vitest_1.beforeEach)(() => {
        queueServiceMock = {
            addAuditJob: vitest_1.vi.fn().mockResolvedValue(true),
        };
        interceptor = new audit_interceptor_1.AuditInterceptor(queueServiceMock);
    });
    const createMockContext = (method, path, body, user) => {
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
        };
    };
    const mockCallHandler = {
        handle: () => (0, rxjs_1.of)('next-handled'),
    };
    (0, vitest_1.it)('should ignore GET requests', () => {
        const context = createMockContext('GET', '/api/v1/patients', {}, { tenantId: 't1', userId: 'u1' });
        interceptor.intercept(context, mockCallHandler);
        (0, vitest_1.expect)(queueServiceMock.addAuditJob).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should intercept POST requests and log audit event', () => {
        const context = createMockContext('POST', '/api/v1/patients', { name: 'John' }, { tenantId: 't1', userId: 'u1' });
        interceptor.intercept(context, mockCallHandler);
        (0, vitest_1.expect)(queueServiceMock.addAuditJob).toHaveBeenCalledWith('log-audit-event', vitest_1.expect.objectContaining({
            tenantId: 't1',
            userId: 'u1',
            action: 'POST /api/v1/patients',
            entity: 'patients',
        }));
    });
    (0, vitest_1.it)('should sanitize passwords in request body', () => {
        const context = createMockContext('POST', '/api/v1/users', { username: 'test', password: 'secretpassword' }, { tenantId: 't1', userId: 'u1' });
        interceptor.intercept(context, mockCallHandler);
        (0, vitest_1.expect)(queueServiceMock.addAuditJob).toHaveBeenCalledWith('log-audit-event', vitest_1.expect.objectContaining({
            details: {
                username: 'test',
                password: '[REDACTED]'
            }
        }));
    });
});
