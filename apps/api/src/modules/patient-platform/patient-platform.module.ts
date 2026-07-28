import { Module } from '@nestjs/common';
import { PatientPlatformController } from './patient-platform.controller';
import { PatientPlatformService } from './services/patient-platform.service';
import { BookingGatewayService } from './services/booking-gateway.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PatientPlatformController],
  providers: [PatientPlatformService, BookingGatewayService],
  exports: [PatientPlatformService, BookingGatewayService],
})
export class PatientPlatformModule {}
