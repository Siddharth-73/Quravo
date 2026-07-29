"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
const RAZORPAY_CURRENCY = 'INR';
let PaymentsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PaymentsService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            PaymentsService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        eventEmitter;
        razorpayProvider;
        logger = new common_1.Logger(PaymentsService.name);
        constructor(eventEmitter, razorpayProvider) {
            this.eventEmitter = eventEmitter;
            this.razorpayProvider = razorpayProvider;
        }
        async getPayableInvoice(tenantId, invoiceId) {
            const [invoice] = await db_1.db
                .select()
                .from(db_1.invoices)
                .where((0, db_1.and)((0, db_1.eq)(db_1.invoices.tenantId, tenantId), (0, db_1.eq)(db_1.invoices.id, invoiceId)))
                .limit(1);
            if (!invoice)
                throw new common_1.NotFoundException('Invoice not found');
            if (invoice.status === 'paid' || invoice.status === 'cancelled' || invoice.status === 'voided') {
                throw new common_1.BadRequestException(`Cannot make a payment on a ${invoice.status} invoice`);
            }
            return invoice;
        }
        /**
         * Applies a settled payment amount to an invoice: updates amountDue/status
         * and emits the domain event. Shared by manual (cash/card-recorded-manually)
         * payments and gateway-verified (Razorpay) payments.
         */
        async settleInvoiceForPayment(invoice, paymentAmount) {
            const currentAmountDue = parseFloat(invoice.amountDue);
            const newAmountDue = Math.max(currentAmountDue - paymentAmount, 0);
            let newStatus = invoice.status;
            if (newAmountDue <= 0) {
                newStatus = 'paid';
            }
            else if (newAmountDue < parseFloat(invoice.totalAmount)) {
                newStatus = 'partially_paid';
            }
            await db_1.db
                .update(db_1.invoices)
                .set({
                amountDue: newAmountDue.toFixed(2),
                status: newStatus,
                updatedAt: new Date(),
            })
                .where((0, db_1.eq)(db_1.invoices.id, invoice.id));
        }
        async createPayment(tenantId, collectedById, dto) {
            const invoice = await this.getPayableInvoice(tenantId, dto.invoiceId);
            const currentAmountDue = parseFloat(invoice.amountDue);
            const paymentAmount = dto.amount;
            if (paymentAmount > currentAmountDue) {
                throw new common_1.BadRequestException(`Payment amount cannot exceed amount due (${currentAmountDue})`);
            }
            const [payment] = await db_1.db
                .insert(db_1.payments)
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
        async createRazorpayOrder(tenantId, collectedById, dto) {
            const invoice = await this.getPayableInvoice(tenantId, dto.invoiceId);
            const amountDue = parseFloat(invoice.amountDue);
            if (amountDue <= 0) {
                throw new common_1.BadRequestException('Invoice has no outstanding balance to collect.');
            }
            const amountInPaise = Math.round(amountDue * 100);
            const order = await this.razorpayProvider.createOrder({
                amountInPaise,
                currency: RAZORPAY_CURRENCY,
                receipt: invoice.invoiceNumber,
                notes: { tenantId, invoiceId: invoice.id },
            });
            const [pendingPayment] = await db_1.db
                .insert(db_1.payments)
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
        async verifyRazorpayPayment(tenantId, dto) {
            const [pendingPayment] = await db_1.db
                .select()
                .from(db_1.payments)
                .where((0, db_1.and)((0, db_1.eq)(db_1.payments.tenantId, tenantId), (0, db_1.eq)(db_1.payments.gatewayOrderId, dto.razorpayOrderId), (0, db_1.eq)(db_1.payments.invoiceId, dto.invoiceId)))
                .limit(1);
            if (!pendingPayment) {
                throw new common_1.NotFoundException('No matching pending payment found for this order.');
            }
            if (pendingPayment.status !== 'pending') {
                throw new common_1.BadRequestException('This payment has already been processed.');
            }
            const isValidSignature = this.razorpayProvider.verifyPaymentSignature(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature);
            if (!isValidSignature) {
                await db_1.db.update(db_1.payments).set({ status: 'failed', updatedAt: new Date() }).where((0, db_1.eq)(db_1.payments.id, pendingPayment.id));
                throw new common_1.BadRequestException('Payment signature verification failed.');
            }
            const invoice = await this.getPayableInvoice(tenantId, pendingPayment.invoiceId);
            const [confirmedPayment] = await db_1.db
                .update(db_1.payments)
                .set({
                status: 'completed',
                transactionId: dto.razorpayPaymentId,
                updatedAt: new Date(),
            })
                .where((0, db_1.eq)(db_1.payments.id, pendingPayment.id))
                .returning();
            await this.settleInvoiceForPayment(invoice, parseFloat(pendingPayment.amount));
            this.eventEmitter.emit('payment.collected', {
                paymentId: confirmedPayment.id,
                invoiceId: invoice.id,
                tenantId,
            });
            return confirmedPayment;
        }
    };
    return PaymentsService = _classThis;
})();
exports.PaymentsService = PaymentsService;
