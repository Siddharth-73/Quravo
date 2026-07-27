import { Controller, Post, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { QueueService } from '../../queue/queue.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly queueService: QueueService) {}

  @Post('patient-summary')
  @HttpCode(202)
  async generatePatientSummary(@Req() req: Request, @Body() data: { patientId: string }) {
    const user = (req as any).user;
    
    // Dispatch to background worker
    await this.queueService.addAiJob('generate-patient-summary', {
      tenantId: user.tenantId,
      userId: user.userId,
      patientId: data.patientId,
    });

    return { status: 'queued', message: 'Patient summary generation started.' };
  }

  @Post('consultation-notes')
  @HttpCode(202)
  async generateConsultationNotes(@Req() req: Request, @Body() data: { appointmentId: string, rawNotes: string }) {
    const user = (req as any).user;
    
    // Dispatch to background worker
    await this.queueService.addAiJob('generate-consultation-notes', {
      tenantId: user.tenantId,
      userId: user.userId,
      appointmentId: data.appointmentId,
      rawNotes: data.rawNotes,
    });

    return { status: 'queued', message: 'Consultation notes generation started.' };
  }
}
