import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { db, analyticsSummaries, invoices, appointments, eq, and, sql } from '@quravo/db';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Processor('analytics.queue')
export class AnalyticsProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalyticsProcessor.name);
  private redisConnection: Redis;

  constructor(private readonly configService: ConfigService) {
    super();
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
    const revenueQuery = db.select({
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

    const appointmentQuery = db.select({
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
      totalRevenue: Number(revenueResult?.total || 0).toFixed(2),
      totalAppointments: Number(appointmentResult?.total || 0),
      totalWalkIns: 0,
      newPatients: 0,
    };

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

    const cacheKey = `analytics:tenant:${tenantId}:branch:${branchId || 'all'}:date:${targetDate}`;
    await this.redisConnection.set(cacheKey, JSON.stringify(upserted), 'EX', 3600);
    
    this.logger.log(`Completed analytics compute for ${cacheKey}`);
    return upserted;
  }
}
