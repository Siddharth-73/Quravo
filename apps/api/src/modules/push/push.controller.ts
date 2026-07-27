import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { PushService } from './push.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('push')
@UseGuards(JwtAuthGuard)
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  async subscribe(
    @Req() req: Request,
    @Body() subscriptionData: any
  ) {
    const user = (req as any).user;
    return this.pushService.saveSubscription(user.tenantId, user.id, subscriptionData);
  }
}
