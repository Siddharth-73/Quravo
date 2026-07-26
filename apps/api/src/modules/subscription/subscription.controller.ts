import { Controller, Get, Post, Body, Headers, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMySubscription(@Req() req: Request) {
    const tenantId = (req as any).user.tenantId;
    return this.subscriptionService.getSubscription(tenantId);
  }

  @Post('change-plan')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('clinic:write')
  async changePlan(@Req() req: Request, @Body() body: { newPlanTier: string }) {
    const tenantId = (req as any).user.tenantId;
    return this.subscriptionService.changePlan(tenantId, body.newPlanTier);
  }

  @Get('feature-flags')
  @UseGuards(JwtAuthGuard)
  async getFeatureFlags(@Req() req: Request) {
    const tenantId = (req as any).user.tenantId;
    return this.subscriptionService.getFeatureFlags(tenantId);
  }

  @Post('feature-flags/toggle')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('roles:write')
  async toggleFeatureFlag(
    @Req() req: Request,
    @Body() body: { flagKey: string; enabled: boolean }
  ) {
    const tenantId = (req as any).user.tenantId;
    return this.subscriptionService.toggleFeatureFlag(tenantId, body.flagKey, body.enabled);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() payload: any
  ) {
    return this.subscriptionService.handleWebhook(signature || 'mock-sig', payload);
  }
}
