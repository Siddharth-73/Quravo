import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DatabaseService } from '../../database/database.service';
import { QueueService } from '../../queue/queue.service';
import { invoices, invoiceItems, eq, and, sql } from '@quravo/db';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly queueService: QueueService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  private async generateInvoiceNumber(tenantId: string): Promise<string> {
    const db = this.dbService.db;
    const year = new Date().getFullYear();
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(invoices)
      .where(eq(invoices.tenantId, tenantId));

    const sequence = (count + 1).toString().padStart(4, '0');
    return `INV-${year}-${sequence}`;
  }

  async createInvoice(tenantId: string, createdById: string, dto: CreateInvoiceDto) {
    const db = this.dbService.db;
    const invoiceNumber = await this.generateInvoiceNumber(tenantId);

    let subtotal = 0;
    let taxAmount = 0;
    
    const itemsData = dto.items.map(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const taxRate = item.taxRate || 0;
      const itemTax = itemSubtotal * (taxRate / 100);
      const itemTotal = itemSubtotal + itemTax;
      
      subtotal += itemSubtotal;
      taxAmount += itemTax;
      
      return {
        ...item,
        total: itemTotal.toFixed(2),
        unitPrice: item.unitPrice.toString(),
        taxRate: taxRate.toString(),
      };
    });
    
    const discountAmount = 0; 
    const totalAmount = subtotal + taxAmount - discountAmount;
    
    const [invoice] = await db.insert(invoices).values({
      tenantId,
      branchId: dto.branchId,
      patientId: dto.patientId,
      invoiceNumber,
      status: 'pending',
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      amountDue: totalAmount.toFixed(2),
      dueDate: dto.dueDate ? new Date(dto.dueDate) : new Date(),
      issuedAt: new Date(),
      notes: dto.notes,
      createdById,
    }).returning();
    
    const insertedItems = await db.insert(invoiceItems).values(
      itemsData.map(item => ({
        tenantId,
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        total: item.total,
        referenceType: item.referenceType,
        referenceId: item.referenceId,
      }))
    ).returning();
    
    this.eventEmitter.emit('invoice.created', { invoiceId: invoice.id, tenantId });
    
    return { ...invoice, items: insertedItems };
  }
  
  async getInvoice(tenantId: string, invoiceId: string) {
    const db = this.dbService.db;
    const [invoice] = await db.select().from(invoices)
      .where(and(eq(invoices.tenantId, tenantId), eq(invoices.id, invoiceId)))
      .limit(1);
      
    if (!invoice) throw new NotFoundException('Invoice not found');
    
    const items = await db.select().from(invoiceItems)
      .where(and(eq(invoiceItems.tenantId, tenantId), eq(invoiceItems.invoiceId, invoiceId)));
      
    return { ...invoice, items };
  }
  
  async listInvoices(tenantId: string) {
    const db = this.dbService.db;
    return db.select().from(invoices)
      .where(eq(invoices.tenantId, tenantId))
      .orderBy(sql`${invoices.createdAt} DESC`);
  }
}
