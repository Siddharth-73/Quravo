import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let redisGetMock: any;
  let redisSetMock: any;
  let dbSelectMock: any;
  let queueAddAnalyticsJobMock: any;

  beforeEach(async () => {
    redisGetMock = vi.fn();
    redisSetMock = vi.fn();
    dbSelectMock = vi.fn();
    queueAddAnalyticsJobMock = vi.fn();

    const mockDbService = {
      db: {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
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

    service = new AnalyticsService(mockDbService as any, mockQueueService as any);
  });

  it('should return cached data if available in Redis', async () => {
    const cachedData = { totalRevenue: '100.00' };
    redisGetMock.mockResolvedValue(JSON.stringify(cachedData));

    const result = await service.getDailySummary('tenant-1', 'branch-1', '2023-10-01');

    expect(result).toEqual(cachedData);
    expect(dbSelectMock).not.toHaveBeenCalled();
    expect(queueAddAnalyticsJobMock).not.toHaveBeenCalled();
  });

  it('should fallback to DB if cache misses and dispatch worker job if DB misses', async () => {
    redisGetMock.mockResolvedValue(null);
    
    const result = await service.getDailySummary('tenant-1', 'branch-1', '2023-10-01');

    // Expected to query DB
    expect(dbSelectMock).toHaveBeenCalled();
    
    // DB missed (returned []), so expected to dispatch worker job
    expect(queueAddAnalyticsJobMock).toHaveBeenCalledWith('compute-daily', {
      tenantId: 'tenant-1',
      branchId: 'branch-1',
      targetDate: '2023-10-01',
    });

    // Should return "calculating: true" state
    expect(result).toHaveProperty('calculating', true);
  });
});
