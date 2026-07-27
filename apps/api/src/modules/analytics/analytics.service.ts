import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { analyticsSummaries, eq, and } from '@quravo/db';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly queueService: QueueService
  ) {}

  /**
   * Get daily analytics for a tenant.
   * Checks Redis cache first. If not found, falls back to the database summary,
   * and dispatches a background job to recompute if missing.
   */
  async getDailySummary(tenantId: string, branchId?: string, targetDate?: string) {
    const dateStr = targetDate || new Date().toISOString().split('T')[0];
    const redis = this.queueService.redisConnection;
    const cacheKey = `analytics:tenant:${tenantId}:branch:${branchId || 'all'}:date:${dateStr}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      this.logger.warn(`Redis cache fetch failed for key ${cacheKey}`, e);
    }

    // Fallback to database
    let dbSummary;
    const db = this.dbService.db;
    
    if (branchId) {
      const [result] = await db.select().from(analyticsSummaries)
        .where(
          and(
            eq(analyticsSummaries.tenantId, tenantId),
            eq(analyticsSummaries.branchId, branchId),
            eq(analyticsSummaries.summaryDate, dateStr)
          )
        ).limit(1);
      dbSummary = result;
    } else {
      const [result] = await db.select().from(analyticsSummaries)
        .where(
          and(
            eq(analyticsSummaries.tenantId, tenantId),
            eq(analyticsSummaries.summaryDate, dateStr)
          )
        ).limit(1);
      dbSummary = result;
    }

    if (dbSummary) {
      // Re-populate cache for future requests
      await redis.set(cacheKey, JSON.stringify(dbSummary), 'EX', 3600); // 1 hour cache
      return dbSummary;
    }

    // If completely missing, dispatch an on-demand calculation job to the worker
    this.logger.log(`Dispatching on-demand analytics calculation for ${cacheKey}`);
    await this.queueService.addAnalyticsJob('compute-daily', {
      tenantId,
      branchId,
      targetDate: dateStr,
    });

    // Return empty state while calculating
    return {
      tenantId,
      branchId,
      summaryDate: dateStr,
      totalRevenue: '0.00',
      totalAppointments: 0,
      totalWalkIns: 0,
      newPatients: 0,
      calculating: true,
    };
  }
}
