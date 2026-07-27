import { Controller, Post, Get, Body, Param, Req, UseGuards, HttpCode, NotFoundException, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueueService } from '../../queue/queue.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as crypto from 'crypto';

@Controller('export')
@UseGuards(JwtAuthGuard)
export class ExportController {
  constructor(private readonly queueService: QueueService) {}

  @Post('request')
  @HttpCode(202)
  async requestExport(@Req() req: Request, @Body() data: { entity: string, format: 'csv' | 'pdf', filters?: any }) {
    const user = (req as any).user;
    const exportId = crypto.randomUUID();
    
    // Dispatch to background worker
    await this.queueService.addExportJob('generate-export', {
      exportId,
      tenantId: user.tenantId,
      userId: user.userId,
      entity: data.entity,
      format: data.format,
      filters: data.filters,
    });

    return { 
      status: 'queued', 
      exportId,
      message: 'Export generation started. Poll /status for updates.',
      statusUrl: `/api/v1/export/${exportId}/status`
    };
  }

  @Get(':exportId/status')
  async getExportStatus(@Param('exportId') exportId: string, @Req() req: Request) {
    const user = (req as any).user;
    // The worker stores status in Redis: `export:status:${exportId}`
    const statusData = await this.queueService.redisConnection.get(`export:status:${exportId}`);
    
    if (!statusData) {
      // If it doesn't exist yet, it's either pending or invalid. We'll return pending for MVP.
      return { status: 'pending' };
    }

    const parsed = JSON.parse(statusData);
    if (parsed.tenantId !== user.tenantId) {
      throw new NotFoundException('Export not found');
    }

    return parsed;
  }

  @Get(':exportId/download')
  async downloadExport(@Param('exportId') exportId: string, @Req() req: Request, @Res() res: Response) {
    const user = (req as any).user;
    const statusData = await this.queueService.redisConnection.get(`export:status:${exportId}`);
    
    if (!statusData) {
      throw new NotFoundException('Export not found or expired');
    }

    const parsed = JSON.parse(statusData);
    if (parsed.tenantId !== user.tenantId || parsed.status !== 'completed') {
      throw new NotFoundException('Export not found or not ready');
    }

    // Worker stores base64 file data in Redis: `export:file:${exportId}`
    const fileData = await this.queueService.redisConnection.get(`export:file:${exportId}`);
    if (!fileData) {
      throw new NotFoundException('Export file expired');
    }

    const buffer = Buffer.from(fileData, 'base64');
    
    const extension = parsed.format === 'pdf' ? 'pdf' : 'csv';
    const contentType = parsed.format === 'pdf' ? 'application/pdf' : 'text/csv';

    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="export-${exportId}.${extension}"`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
