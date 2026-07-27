import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { payments, invoices, eq, and } from '@quravo/db';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queueService: QueueService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async createPayment(tenantId: string, collectedById: string, dto: CreatePaymentDto) {
    const db = this.dbService.db;
    
    // Validate Invoice
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

    // Insert Payment
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

    // Update Invoice
    const newAmountDue = currentAmountDue - paymentAmount;
    let newStatus = invoice.status;
    
    if (newAmountDue <= 0) {
      newStatus = 'paid';
    } else if (newAmountDue < parseFloat(invoice.totalAmount)) {
      newStatus = 'partially_paid';
    }

    await db.update(invoices).set({
      amountDue: newAmountDue.toFixed(2),
      status: newStatus as any,
      updatedAt: new Date(),
    }).where(eq(invoices.id, invoice.id));

    // Emit event
    this.eventEmitter.emit('payment.collected', { 
      paymentId: payment.id, 
      invoiceId: invoice.id, 
      tenantId 
    });

    return payment;
  }
}
