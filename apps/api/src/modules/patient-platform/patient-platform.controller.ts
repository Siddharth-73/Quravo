import { Controller, Get, Post, Body } from '@nestjs/common';
import { PatientPlatformService } from './services/patient-platform.service';
import { BookingGatewayService } from './services/booking-gateway.service';

@Controller('platform/patient')
export class PatientPlatformController {
  constructor(
    private readonly patientPlatformService: PatientPlatformService,
    private readonly bookingGatewayService: BookingGatewayService,
  ) {}

  @Get('favorites')
  async getFavorites() {
    return { success: true, data: [] };
  }

  @Get('doctors')
  async getDoctors() {
    return this.patientPlatformService.getPublicDoctors();
  }

  @Get('hospitals')
  async getHospitals() {
    return this.patientPlatformService.getPublicHospitals();
  }

  @Post('booking/availability')
  async checkAvailability(@Body() body: any) {
    return this.bookingGatewayService.searchAvailability(body);
  }

  @Post('booking')
  async createBooking(@Body() body: any) {
    return this.bookingGatewayService.createPublicBooking(body);
  }
}
