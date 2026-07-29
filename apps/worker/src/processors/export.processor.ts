import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { parse } from 'json2csv';
import PDFDocument from 'pdfkit';
import { db, patients, invoices, eq } from '@quravo/db';

@Injectable()
export class ExportProcessor implements OnModuleInit {
  private readonly logger = new Logger(ExportProcessor.name);
  private worker!: Worker;
  private redisConnection!: IORedis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisConnection = new IORedis({
      host: redisHost,
      port: redisPort,
      maxRetriesPerRequest: null,
    });

    this.worker = new Worker(
      'export.queue',
      async (job: Job) => {
        this.logger.log(`Processing export job: ${job.name} (ID: ${job.id})`);
        
        try {
          if (job.name === 'generate-export') {
            await this.processExport(job);
          } else {
            this.logger.warn(`Unknown export job type: ${job.name}`);
          }
        } catch (error) {
          this.logger.error(`Failed to process export job ${job.id}`, error);
          await this.updateStatus(job.data.exportId, job.data.tenantId, 'failed', job.data.format);
          throw error;
        }
      },
      { connection: this.redisConnection }
    );

    this.worker.on('failed', (job: Job | undefined, err: Error) => {
      this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
    });
  }

  private async updateStatus(exportId: string, tenantId: string, status: string, format: string, error?: string) {
    const payload = JSON.stringify({
      tenantId,
      status,
      format,
      updatedAt: new Date().toISOString(),
      ...(error ? { error } : {}),
    });
    await this.redisConnection.set(`export:status:${exportId}`, payload, 'EX', 3600);
  }

  private async saveFileData(exportId: string, buffer: Buffer) {
    const base64Data = buffer.toString('base64');
    await this.redisConnection.set(`export:file:${exportId}`, base64Data, 'EX', 3600);
  }

  private async processExport(job: Job) {
    const { exportId, tenantId, entity, format } = job.data;
    await this.updateStatus(exportId, tenantId, 'processing', format);

    let data: Record<string, any>[];

    // TODO: apply job.data.filters
    if (entity === 'patients') {
      data = await db
        .select({
          id: patients.id,
          patientNumber: patients.patientNumber,
          firstName: patients.firstName,
          lastName: patients.lastName,
          email: patients.email,
          phone: patients.phone,
          status: patients.status,
        })
        .from(patients)
        .where(eq(patients.tenantId, tenantId));
    } else if (entity === 'invoices') {
      data = await db.select().from(invoices).where(eq(invoices.tenantId, tenantId));
    } else {
      const errorMessage = `Unsupported export entity: ${entity}`;
      this.logger.warn(errorMessage);
      await this.updateStatus(exportId, tenantId, 'failed', format, errorMessage);
      return;
    }

    let fileBuffer: Buffer;

    if (format === 'csv') {
      const csv = data.length ? parse(data) : '';
      fileBuffer = Buffer.from(csv);
    } else if (format === 'pdf') {
      fileBuffer = await new Promise((resolve) => {
        const doc = new PDFDocument();
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        
        doc.fontSize(20).text(`Export: ${entity}`, { align: 'center' });
        doc.moveDown();
        
        data.forEach((row) => {
          const line = Object.entries(row)
            .map(([key, value]) => `${key}: ${value ?? 'N/A'}`)
            .join(' | ');
          doc.fontSize(12).text(line);
          doc.moveDown(0.5);
        });
        
        doc.end();
      });
    } else {
      throw new Error(`Unsupported export format: ${format}`);
    }

    await this.saveFileData(exportId, fileBuffer);
    await this.updateStatus(exportId, tenantId, 'completed', format);
    this.logger.log(`Export ${exportId} completed successfully.`);
  }
}
