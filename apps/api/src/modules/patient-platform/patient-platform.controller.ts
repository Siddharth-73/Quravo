import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PatientPlatformService } from './services/patient-platform.service';
import { BookingGatewayService } from './services/booking-gateway.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assume this exists in your auth setup

@Controller('platform/patient')
export class PatientPlatformController {
  constructor(
    private readonly patientPlatformService: PatientPlatformService,
    private readonly bookingGatewayService: BookingGatewayService,
  ) {}

  @Get('favorites')
  // @UseGuards(JwtAuthGuard)
  async getFavorites(@Request() req: any) {
    // const userId = req.user.id;
    // return this.patientPlatformService.getFavorites(userId);
    return { success: true, data: [] };
  }

  @Post('booking/availability')
  async checkAvailability(@Body() body: any) {
    return this.bookingGatewayService.searchAvailability(body);
  }
}
