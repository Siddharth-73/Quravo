import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { db, payments, invoices, eq, and } from '@quravo/db';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { CreateRazorpayOrderDto, VerifyRazorpayPaymentDto } from '../dto/razorpay.dto';
import { RazorpayProvider } from '../providers/razorpay.provider';

const RAZORPAY_CURRENCY = 'INR';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly razorpayProvider: RazorpayProvider
  ) {}

  private async getPayableInvoice(tenantId: string, invoiceId: string) {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.tenantId, tenantId), eq(invoices.id, invoiceId)))
      .limit(1);

    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === 'paid' || invoice.status === 'cancelled' || invoice.status === 'voided') {
      throw new BadRequestException(`Cannot make a payment on a ${invoice.status} invoice`);
    }

    return invoice;
  }

  /**
   * Applies a settled payment amount to an invoice: updates amountDue/status
   * and emits the domain event. Shared by manual (cash/card-recorded-manually)
   * payments and gateway-verified (Razorpay) payments.
   */
  private async settleInvoiceForPayment(invoice: typeof invoices.$inferSelect, paymentAmount: number) {
    const currentAmountDue = parseFloat(invoice.amountDue);
    const newAmountDue = Math.max(currentAmountDue - paymentAmount, 0);

    let newStatus: any = invoice.status;
    if (newAmountDue <= 0) {
      newStatus = 'paid';
    } else if (newAmountDue < parseFloat(invoice.totalAmount)) {
      newStatus = 'partially_paid';
    }

    await db
      .update(invoices)
      .set({
        amountDue: newAmountDue.toFixed(2),
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, invoice.id));
  }

  async createPayment(tenantId: string, collectedById: string, dto: CreatePaymentDto) {
    const invoice = await this.getPayableInvoice(tenantId, dto.invoiceId);

    const currentAmountDue = parseFloat(invoice.amountDue);
    const paymentAmount = dto.amount;

    if (paymentAmount > currentAmountDue) {
      throw new BadRequestException(`Payment amount cannot exceed amount due (${currentAmountDue})`);
    }

    const [payment] = await db
      .insert(payments)
      .values({
        tenantId,
        invoiceId: invoice.id,
        patientId: invoice.patientId,
        amount: paymentAmount.toFixed(2),
        paymentMethod: dto.paymentMethod,
        status: 'completed',
        transactionId: dto.transactionId,
        notes: dto.notes,
        collectedById,
      })
      .returning();

    await this.settleInvoiceForPayment(invoice, paymentAmount);

    this.eventEmitter.emit('payment.collected', {
      paymentId: payment.id,
      invoiceId: invoice.id,
      tenantId,
    });

    return payment;
  }

  // --- RAZORPAY GATEWAY FLOW ---

  /**
   * Step 1: Create a Razorpay Order for the invoice's full outstanding balance,
   * and record a `pending` payment row so we can correlate + settle it once the
   * client confirms the payment (see verifyRazorpayPayment).
   */
  async createRazorpayOrder(tenantId: string, collectedById: string, dto: CreateRazorpayOrderDto) {
    const invoice = await this.getPayableInvoice(tenantId, dto.invoiceId);
    const amountDue = parseFloat(invoice.amountDue);

    if (amountDue <= 0) {
      throw new BadRequestException('Invoice has no outstanding balance to collect.');
    }

    const amountInPaise = Math.round(amountDue * 100);

    const order = await this.razorpayProvider.createOrder({
      amountInPaise,
      currency: RAZORPAY_CURRENCY,
      receipt: invoice.invoiceNumber,
      notes: { tenantId, invoiceId: invoice.id },
    });

    const [pendingPayment] = await db
      .insert(payments)
      .values({
        tenantId,
        invoiceId: invoice.id,
        patientId: invoice.patientId,
        amount: amountDue.toFixed(2),
        paymentMethod: 'online_gateway',
        status: 'pending',
        gatewayProvider: 'razorpay',
        gatewayOrderId: order.id,
        collectedById,
      })
      .returning();

    this.logger.log(`Created pending Razorpay payment ${pendingPayment.id} for invoice ${invoice.id}`);

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: this.razorpayProvider.getPublicKeyId(),
      invoiceId: invoice.id,
    };
  }

  /**
   * Step 2: Verify the signature Razorpay Checkout returned to the client, then
   * settle the matching pending payment + invoice. Rejects if the order wasn't
   * ours, doesn't belong to this tenant/invoice, or was already processed
   * (defends against replaying a valid signature against a different invoice).
   */
  async verifyRazorpayPayment(tenantId: string, dto: VerifyRazorpayPaymentDto) {
    const [pendingPayment] = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.tenantId, tenantId),
          eq(payments.gatewayOrderId, dto.razorpayOrderId),
          eq(payments.invoiceId, dto.invoiceId)
        )
      )
      .limit(1);

    if (!pendingPayment) {
      throw new NotFoundException('No matching pending payment found for this order.');
    }

    if (pendingPayment.status !== 'pending') {
      throw new BadRequestException('This payment has already been processed.');
    }

    const isValidSignature = this.razorpayProvider.verifyPaymentSignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature
    );

    if (!isValidSignature) {
      await db.update(payments).set({ status: 'failed', updatedAt: new Date() }).where(eq(payments.id, pendingPayment.id));
      throw new BadRequestException('Payment signature verification failed.');
    }

    const invoice = await this.getPayableInvoice(tenantId, pendingPayment.invoiceId);

    const [confirmedPayment] = await db
      .update(payments)
      .set({
        status: 'completed',
        transactionId: dto.razorpayPaymentId,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, pendingPayment.id))
      .returning();

    await this.settleInvoiceForPayment(invoice, parseFloat(pendingPayment.amount));

    this.eventEmitter.emit('payment.collected', {
      paymentId: confirmedPayment.id,
      invoiceId: invoice.id,
      tenantId,
    });

    return confirmedPayment;
  }
}
