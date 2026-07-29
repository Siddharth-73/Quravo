import { Controller, Post, Get, Body, Param, Req, UseGuards, HttpCode, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';
import { QueueService } from '../../queue/queue.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly queueService: QueueService) {}

  @Post('patient-summary')
  @HttpCode(202)
  async generatePatientSummary(@Req() req: Request, @Body() data: { patientId: string }) {
    const user = (req as any).user;
    const jobId = crypto.randomUUID();

    await this.queueService.addAiJob('generate-patient-summary', {
      jobId,
      tenantId: user.tenantId,
      userId: user.userId,
      patientId: data.patientId,
    });

    return { status: 'queued', jobId, message: 'Patient summary generation started.' };
  }

  @Post('consultation-notes')
  @HttpCode(202)
  async generateConsultationNotes(@Req() req: Request, @Body() data: { appointmentId: string, rawNotes: string }) {
    const user = (req as any).user;
    const jobId = crypto.randomUUID();

    await this.queueService.addAiJob('generate-consultation-notes', {
      jobId,
      tenantId: user.tenantId,
      userId: user.userId,
      appointmentId: data.appointmentId,
      rawNotes: data.rawNotes,
    });

    return { status: 'queued', jobId, message: 'Consultation notes generation started.' };
  }

  @Get('result/:jobId')
  async getResult(@Param('jobId') jobId: string, @Req() req: Request) {
    const user = (req as any).user;
    const resultData = await this.queueService.redisConnection.get(`ai:result:${jobId}`);

    if (!resultData) {
      return { status: 'pending' };
    }

    const parsed = JSON.parse(resultData);
    if (parsed.tenantId !== user.tenantId) {
      throw new NotFoundException('AI result not found');
    }

    return parsed;
  }
}
