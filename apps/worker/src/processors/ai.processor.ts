import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { AiService } from '../providers/ai/ai.service';
import { PATIENT_SUMMARY_PROMPT, CONSULTATION_NOTES_PROMPT } from '@quravo/contracts';

@Injectable()
export class AiProcessor implements OnModuleInit {
  private readonly logger = new Logger(AiProcessor.name);
  private worker!: Worker;

  constructor(
    private readonly configService: ConfigService,
    private readonly aiService: AiService
  ) {}

  onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const redisPort = this.configService.get<number>('REDIS_PORT', 6379);

    const connection = new IORedis({
      host: redisHost,
      port: redisPort,
      maxRetriesPerRequest: null,
    });

    this.worker = new Worker(
      'ai.queue',
      async (job: Job) => {
        this.logger.log(`Processing AI job: ${job.name} (ID: ${job.id})`);
        
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
          throw error;
        }
      },
      { connection }
    );

    this.worker.on('failed', (job: Job | undefined, err: Error) => {
      this.logger.error(`Job ${job?.id} failed with error: ${err.message}`);
    });
  }

  private async processPatientSummary(job: Job) {
    const { patientId } = job.data;
    const generated = await this.aiService.generateCompletion([
      { role: 'system', content: PATIENT_SUMMARY_PROMPT },
      { role: 'user', content: `Summarize the clinical profile for patient ${patientId}` }
    ]);
    
    this.logger.log(`Successfully generated summary for patient ${patientId}`);
    return generated;
  }

  private async processConsultationNotes(job: Job) {
    const { appointmentId, rawNotes } = job.data;
    const generated = await this.aiService.generateCompletion([
      { role: 'system', content: CONSULTATION_NOTES_PROMPT },
      { role: 'user', content: `Here are the raw notes: ${rawNotes}` }
    ]);
    
    this.logger.log(`Successfully generated SOAP notes for appointment ${appointmentId}`);
    return generated;
  }
}
