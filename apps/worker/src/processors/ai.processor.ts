import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { db, patients, emrEncounters, eq, and, desc } from '@quravo/db';
import { AiService } from '../providers/ai/ai.service';
import { PATIENT_SUMMARY_PROMPT, CONSULTATION_NOTES_PROMPT } from '@quravo/contracts';

@Injectable()
export class AiProcessor implements OnModuleInit {
  private readonly logger = new Logger(AiProcessor.name);
  private worker!: Worker;
  private redisConnection!: IORedis;

  constructor(
    private readonly configService: ConfigService,
    private readonly aiService: AiService
  ) {}

  onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);

    this.redisConnection = new IORedis({
      host: redisHost,
      port: redisPort,
      maxRetriesPerRequest: null,
    });

    this.worker = new Worker(
      'ai.queue',
      async (job: Job) => {
        this.logger.log(`Processing AI job: ${job.name} (ID: ${job.id})`);
        const { jobId, tenantId } = job.data;

        try {
          if (job.name === 'generate-patient-summary') {
            await this.processPatientSummary(job);
          } else if (job.name === 'generate-consultation-notes') {
            await this.processConsultationNotes(job);
          } else {
            this.logger.warn(`Unknown AI job type: ${job.name}`);
          }
        } catch (error) {
          this.logger.error(`Failed to process AI job ${job.id}`, error);
          if (jobId) {
            await this.saveResult(jobId, {
              tenantId,
              status: 'failed',
              error: (error as Error).message,
            });
          }
          throw error;
        }
      },
      { connection: this.redisConnection }
    );

    this.worker.on('failed', (job: Job | undefined, err: Error) => {
      this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
    });
  }

  private async saveResult(jobId: string, payload: Record<string, any>) {
    await this.redisConnection.set(`ai:result:${jobId}`, JSON.stringify(payload), 'EX', 3600);
  }

  private async processPatientSummary(job: Job) {
    const { jobId, tenantId, patientId } = job.data;

    const [patient] = await db
      .select()
      .from(patients)
      .where(and(eq(patients.tenantId, tenantId), eq(patients.id, patientId)))
      .limit(1);

    if (!patient) {
      this.logger.warn(`Patient ${patientId} not found for tenant ${tenantId}`);
      await this.saveResult(jobId, {
        tenantId,
        status: 'failed',
        error: `Patient ${patientId} not found`,
      });
      return;
    }

    const recentEncounters = await db
      .select()
      .from(emrEncounters)
      .where(and(eq(emrEncounters.tenantId, tenantId), eq(emrEncounters.patientId, patientId)))
      .orderBy(desc(emrEncounters.encounterDate))
      .limit(5);

    const encountersSummary = recentEncounters.length
      ? recentEncounters
          .map((enc, idx) => {
            const diagnosis = Array.isArray(enc.assessmentDiagnosis) ? enc.assessmentDiagnosis.join(', ') : '';
            return `${idx + 1}. Date: ${new Date(enc.encounterDate).toISOString().slice(0, 10)} | Chief Complaint: ${enc.chiefComplaint} | Assessment: ${diagnosis || 'N/A'} | Plan: ${enc.treatmentPlan || 'N/A'}`;
          })
          .join('\n')
      : 'No prior encounters on record.';

    const context = `Patient: ${patient.firstName} ${patient.lastName}
Date of Birth: ${patient.dateOfBirth}
Gender: ${patient.gender}
Blood Group: ${patient.bloodGroup || 'Unknown'}

Recent Encounters:
${encountersSummary}`;

    const generated = await this.aiService.generateCompletion([
      { role: 'system', content: PATIENT_SUMMARY_PROMPT },
      { role: 'user', content: `Summarize the clinical profile for the following patient:\n\n${context}` }
    ]);

    await this.saveResult(jobId, {
      tenantId,
      status: 'completed',
      result: generated,
      completedAt: new Date().toISOString(),
    });

    this.logger.log(`Successfully generated summary for patient ${patientId}`);
    return generated;
  }

  private async processConsultationNotes(job: Job) {
    const { jobId, tenantId, appointmentId, rawNotes } = job.data;
    const generated = await this.aiService.generateCompletion([
      { role: 'system', content: CONSULTATION_NOTES_PROMPT },
      { role: 'user', content: `Here are the raw notes: ${rawNotes}` }
    ]);

    await this.saveResult(jobId, {
      tenantId,
      status: 'completed',
      result: generated,
      completedAt: new Date().toISOString(),
    });

    this.logger.log(`Successfully generated SOAP notes for appointment ${appointmentId}`);
    return generated;
  }
}
