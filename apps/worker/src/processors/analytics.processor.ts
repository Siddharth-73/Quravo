import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '../providers/database.service';
import { analyticsSummaries, invoices, appointments, eq, and, sql } from '@quravo/db';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Processor('analytics.queue')
export class AnalyticsProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsProcessor.name);
  private redisConnection: Redis;

  constructor(
    private readonly dbService: DatabaseService,
    private readonly configService: ConfigService
  ) {
    super();
    
    // Quick redis connection for caching results
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    this.redisConnection = new Redis({ host, port });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing analytics job ${job.id} for tenant ${job.data.tenantId}`);

    if (job.name === 'compute-daily') {
      return this.computeDailyAnalytics(job.data.tenantId, job.data.branchId, job.data.targetDate);
    }
    
    this.logger.warn(`Unknown job name: ${job.name}`);
  }

  private async computeDailyAnalytics(tenantId: string, branchId: string | undefined, targetDate: string) {
    const db = this.dbService.db;
    
    // 1. Calculate Total Revenue (Sum of paid invoices)
    let revenueQuery = db.select({
      total: sql<number>`COALESCE(SUM(${invoices.totalAmount}), 0)`
    })
    .from(invoices)
    .where(
      and(
        eq(invoices.tenantId, tenantId),
        eq(invoices.status, 'paid'),
        sql`DATE(${invoices.createdAt}) = ${targetDate}`
      )
    );
    
    // Note: Drizzle doesn't perfectly support dynamic WHERE with optional branchId on a table that doesn't have it,
    // assuming invoices has branchId if we filter by it, but for MVP let's assume we sum across tenant if branchId isn't on invoice.

    // 2. Calculate Total Appointments
    let appointmentQuery = db.select({
      total: sql<number>`COUNT(*)`
    })
    .from(appointments)
    .where(
      and(
        eq(appointments.tenantId, tenantId),
        sql`DATE(${appointments.startTime}) = ${targetDate}`
      )
    );

    const [revenueResult] = await revenueQuery;
    const [appointmentResult] = await appointmentQuery;

    const summary = {
      tenantId,
      branchId: branchId || null,
      summaryDate: targetDate,
      totalRevenue: Number(revenueResult.total).toFixed(2),
      totalAppointments: Number(appointmentResult.total),
      totalWalkIns: 0, // Mocked for now
      newPatients: 0, // Mocked for now
    };

    // Upsert into analytics_summaries table
    const [upserted] = await db.insert(analyticsSummaries)
      .values(summary)
      .onConflictDoUpdate({
        target: [analyticsSummaries.tenantId, analyticsSummaries.branchId, analyticsSummaries.summaryDate],
        set: {
          totalRevenue: summary.totalRevenue,
          totalAppointments: summary.totalAppointments,
          updatedAt: new Date(),
        }
      })
      .returning();

    // Cache the result in Redis so the API can read it instantly
    const cacheKey = `analytics:tenant:${tenantId}:branch:${branchId || 'all'}:date:${targetDate}`;
    await this.redisConnection.set(cacheKey, JSON.stringify(upserted), 'EX', 3600);
    
    this.logger.log(`Completed analytics compute for ${cacheKey}`);
    return upserted;
  }
}
