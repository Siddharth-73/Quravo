import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { db, payments, invoices, eq, and } from '@quravo/db';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async createPayment(tenantId: string, collectedById: string, dto: CreatePaymentDto) {
    const [invoice] = await db.select().from(invoices)
      .where(and(eq(invoices.tenantId, tenantId), eq(invoices.id, dto.invoiceId)))
      .limit(1);
      
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === 'paid' || invoice.status === 'cancelled' || invoice.status === 'voided') {
      throw new BadRequestException(`Cannot make a payment on a ${invoice.status} invoice`);
    }

    const currentAmountDue = parseFloat(invoice.amountDue);
    const paymentAmount = dto.amount;

    if (paymentAmount > currentAmountDue) {
      throw new BadRequestException(`Payment amount cannot exceed amount due (${currentAmountDue})`);
    }

    const [payment] = await db.insert(payments).values({
      tenantId,
      invoiceId: invoice.id,
      patientId: invoice.patientId,
      amount: paymentAmount.toFixed(2),
      paymentMethod: dto.paymentMethod,
      status: 'completed',
      transactionId: dto.transactionId,
      notes: dto.notes,
      collectedById,
    }).returning();

    const newAmountDue = currentAmountDue - paymentAmount;
    let newStatus: any = invoice.status;
    
    if (newAmountDue <= 0) {
      newStatus = 'paid';
    } else if (newAmountDue < parseFloat(invoice.totalAmount)) {
      newStatus = 'partially_paid';
    }

    await db.update(invoices).set({
      amountDue: newAmountDue.toFixed(2),
      status: newStatus,
      updatedAt: new Date(),
    }).where(eq(invoices.id, invoice.id));

    this.eventEmitter.emit('payment.collected', { 
      paymentId: payment.id, 
      invoiceId: invoice.id, 
      tenantId 
    });

    return payment;
  }
}
