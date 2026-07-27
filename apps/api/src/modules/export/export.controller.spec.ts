import { Test, TestingModule } from '@nestjs/testing';
import { ExportController } from './export.controller';
import { QueueService } from '../../queue/queue.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Request, Response } from 'express';

describe('ExportController', () => {
  let controller: ExportController;
  let queueAddExportJobMock: any;
  let redisGetMock: any;

  beforeEach(async () => {
    queueAddExportJobMock = vi.fn().mockResolvedValue(true);
    redisGetMock = vi.fn();

    const mockQueueService = {
      addExportJob: queueAddExportJobMock,
      redisConnection: {
        get: redisGetMock,
      },
    };

    controller = new ExportController(mockQueueService as any);
  });

  it('should push job to queue and return status queued', async () => {
    const mockRequest = { user: { tenantId: 'tenant-1', userId: 'user-1' } } as unknown as Request;
    
    const response = await controller.requestExport(mockRequest, {
      entity: 'patients',
      format: 'csv'
    });

    expect(response.status).toBe('queued');
    expect(response.exportId).toBeDefined();
    expect(queueAddExportJobMock).toHaveBeenCalledWith('generate-export', expect.objectContaining({
      tenantId: 'tenant-1',
      entity: 'patients',
      format: 'csv'
    }));
  });

  it('should return export status from Redis', async () => {
    const mockRequest = { user: { tenantId: 'tenant-1' } } as unknown as Request;
    
    redisGetMock.mockResolvedValue(JSON.stringify({
      tenantId: 'tenant-1',
      status: 'completed',
      format: 'csv'
    }));

    const response = await controller.getExportStatus('export-123', mockRequest);

    expect(response.status).toBe('completed');
  });
});
