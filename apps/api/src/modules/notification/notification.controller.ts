import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const user = (req as any).user;
    return this.notificationService.getUserNotifications(user.tenantId, user.id, {
      page: parseInt(page || '1', 10),
      limit: parseInt(limit || '20', 10),
      unreadOnly: unreadOnly === 'true',
    });
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const user = (req as any).user;
    return this.notificationService.getUnreadCount(user.tenantId, user.id);
  }

  @Put(':id/read')
  async markAsRead(@Req() req: Request, @Param('id') id: string) {
    const user = (req as any).user;
    return this.notificationService.markAsRead(user.tenantId, user.id, id);
  }

  @Put('read-all')
  async markAllAsRead(@Req() req: Request) {
    const user = (req as any).user;
    return this.notificationService.markAllAsRead(user.tenantId, user.id);
  }
}
