import { Module } from '@nestjs/common';
import { InvoicesController } from './controllers/invoices.controller';
import { PaymentsController } from './controllers/payments.controller';
import { InvoicesService } from './services/invoices.service';
import { PaymentsService } from './services/payments.service';

@Module({
  controllers: [InvoicesController, PaymentsController],
  providers: [InvoicesService, PaymentsService],
  exports: [InvoicesService, PaymentsService],
})
export class BillingModule {}
