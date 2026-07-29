"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_service_1 = require("./analytics.service");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('AnalyticsService', () => {
    let service;
    let redisGetMock;
    let redisSetMock;
    let dbSelectMock;
    let queueAddAnalyticsJobMock;
    (0, vitest_1.beforeEach)(async () => {
        redisGetMock = vitest_1.vi.fn();
        redisSetMock = vitest_1.vi.fn();
        dbSelectMock = vitest_1.vi.fn();
        queueAddAnalyticsJobMock = vitest_1.vi.fn();
        const mockDbService = {
            db: {
                select: vitest_1.vi.fn().mockReturnThis(),
                from: vitest_1.vi.fn().mockReturnThis(),
                where: vitest_1.vi.fn().mockReturnThis(),
                limit: dbSelectMock.mockResolvedValue([]),
            },
        };
        const mockQueueService = {
            redisConnection: {
                get: redisGetMock,
                set: redisSetMock,
            },
            addAnalyticsJob: queueAddAnalyticsJobMock,
        };
        service = new analytics_service_1.AnalyticsService(mockDbService, mockQueueService);
    });
    (0, vitest_1.it)('should return cached data if available in Redis', async () => {
        const cachedData = { totalRevenue: '100.00' };
        redisGetMock.mockResolvedValue(JSON.stringify(cachedData));
        const result = await service.getDailySummary('tenant-1', 'branch-1', '2023-10-01');
        (0, vitest_1.expect)(result).toEqual(cachedData);
        (0, vitest_1.expect)(dbSelectMock).not.toHaveBeenCalled();
        (0, vitest_1.expect)(queueAddAnalyticsJobMock).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should fallback to DB if cache misses and dispatch worker job if DB misses', async () => {
        redisGetMock.mockResolvedValue(null);
        const result = await service.getDailySummary('tenant-1', 'branch-1', '2023-10-01');
        // Expected to query DB
        (0, vitest_1.expect)(dbSelectMock).toHaveBeenCalled();
        // DB missed (returned []), so expected to dispatch worker job
        (0, vitest_1.expect)(queueAddAnalyticsJobMock).toHaveBeenCalledWith('compute-daily', {
            tenantId: 'tenant-1',
            branchId: 'branch-1',
            targetDate: '2023-10-01',
        });
        // Should return "calculating: true" state
        (0, vitest_1.expect)(result).toHaveProperty('calculating', true);
    });
});
