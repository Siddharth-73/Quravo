import { Module, forwardRef } from '@nestjs/common';
import { InvoicesController } from './controllers/invoices.controller';
import { PaymentsController } from './controllers/payments.controller';
import { BillingController } from './controllers/billing.controller';
import { InvoicesService } from './services/invoices.service';
import { PaymentsService } from './services/payments.service';
import { RazorpayProvider } from './providers/razorpay.provider';
import { TenantModule } from '../tenant/tenant.module';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [forwardRef(() => TenantModule), forwardRef(() => RbacModule)],
  controllers: [InvoicesController, PaymentsController, BillingController],
  providers: [InvoicesService, PaymentsService, RazorpayProvider],
  exports: [InvoicesService, PaymentsService],
})
export class BillingModule {}
