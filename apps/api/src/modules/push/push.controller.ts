import { Controller, Post, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { PushService } from './push.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('push')
@UseGuards(JwtAuthGuard)
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  @HttpCode(201)
  async subscribe(@Req() req: Request, @Body() subscription: any) {
    const user = (req as any).user;
    return this.pushService.saveSubscription(user.tenantId, user.userId, subscription);
  }
}
