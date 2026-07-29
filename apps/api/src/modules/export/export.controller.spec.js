"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const export_controller_1 = require("./export.controller");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('ExportController', () => {
    let controller;
    let queueAddExportJobMock;
    let redisGetMock;
    (0, vitest_1.beforeEach)(async () => {
        queueAddExportJobMock = vitest_1.vi.fn().mockResolvedValue(true);
        redisGetMock = vitest_1.vi.fn();
        const mockQueueService = {
            addExportJob: queueAddExportJobMock,
            redisConnection: {
                get: redisGetMock,
            },
        };
        controller = new export_controller_1.ExportController(mockQueueService);
    });
    (0, vitest_1.it)('should push job to queue and return status queued', async () => {
        const mockRequest = { user: { tenantId: 'tenant-1', userId: 'user-1' } };
        const response = await controller.requestExport(mockRequest, {
            entity: 'patients',
            format: 'csv'
        });
        (0, vitest_1.expect)(response.status).toBe('queued');
        (0, vitest_1.expect)(response.exportId).toBeDefined();
        (0, vitest_1.expect)(queueAddExportJobMock).toHaveBeenCalledWith('generate-export', vitest_1.expect.objectContaining({
            tenantId: 'tenant-1',
            entity: 'patients',
            format: 'csv'
        }));
    });
    (0, vitest_1.it)('should return export status from Redis', async () => {
        const mockRequest = { user: { tenantId: 'tenant-1' } };
        redisGetMock.mockResolvedValue(JSON.stringify({
            tenantId: 'tenant-1',
            status: 'completed',
            format: 'csv'
        }));
        const response = await controller.getExportStatus('export-123', mockRequest);
        (0, vitest_1.expect)(response.status).toBe('completed');
    });
});
