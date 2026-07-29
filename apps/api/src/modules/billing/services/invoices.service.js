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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const db_1 = require("@quravo/db");
let InvoicesService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var InvoicesService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InvoicesService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        eventEmitter;
        constructor(eventEmitter) {
            this.eventEmitter = eventEmitter;
        }
        async generateInvoiceNumber(tenantId) {
            const year = new Date().getFullYear();
            const [{ count }] = await db_1.db
                .select({ count: (0, db_1.sql) `count(*)::int` })
                .from(db_1.invoices)
                .where((0, db_1.eq)(db_1.invoices.tenantId, tenantId));
            const sequence = (count + 1).toString().padStart(4, '0');
            return `INV-${year}-${sequence}`;
        }
        async createInvoice(tenantId, createdById, dto) {
            const invoiceNumber = await this.generateInvoiceNumber(tenantId);
            let subtotal = 0;
            let taxAmount = 0;
            const itemsData = dto.items.map((item) => {
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
            const [invoice] = await db_1.db.insert(db_1.invoices).values({
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
            const insertedItems = await db_1.db.insert(db_1.invoiceItems).values(itemsData.map((item) => ({
                tenantId,
                invoiceId: invoice.id,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                total: item.total,
                referenceType: item.referenceType,
                referenceId: item.referenceId,
            }))).returning();
            this.eventEmitter.emit('invoice.created', { invoiceId: invoice.id, tenantId });
            return { ...invoice, items: insertedItems };
        }
        async getInvoice(tenantId, invoiceId) {
            const [row] = await db_1.db
                .select({ invoice: db_1.invoices, patient: db_1.patients })
                .from(db_1.invoices)
                .leftJoin(db_1.patients, (0, db_1.and)((0, db_1.eq)(db_1.patients.id, db_1.invoices.patientId), (0, db_1.eq)(db_1.patients.tenantId, tenantId)))
                .where((0, db_1.and)((0, db_1.eq)(db_1.invoices.tenantId, tenantId), (0, db_1.eq)(db_1.invoices.id, invoiceId)))
                .limit(1);
            if (!row)
                throw new common_1.NotFoundException('Invoice not found');
            const items = await db_1.db.select().from(db_1.invoiceItems)
                .where((0, db_1.and)((0, db_1.eq)(db_1.invoiceItems.tenantId, tenantId), (0, db_1.eq)(db_1.invoiceItems.invoiceId, invoiceId)));
            return {
                ...row.invoice,
                patientName: row.patient ? `${row.patient.firstName} ${row.patient.lastName}` : 'Unknown Patient',
                items,
            };
        }
        async listInvoices(tenantId) {
            const rows = await db_1.db
                .select({ invoice: db_1.invoices, patient: db_1.patients })
                .from(db_1.invoices)
                .leftJoin(db_1.patients, (0, db_1.and)((0, db_1.eq)(db_1.patients.id, db_1.invoices.patientId), (0, db_1.eq)(db_1.patients.tenantId, tenantId)))
                .where((0, db_1.eq)(db_1.invoices.tenantId, tenantId))
                .orderBy((0, db_1.sql) `${db_1.invoices.createdAt} DESC`);
            return rows.map((row) => ({
                ...row.invoice,
                patientName: row.patient ? `${row.patient.firstName} ${row.patient.lastName}` : 'Unknown Patient',
            }));
        }
    };
    return InvoicesService = _classThis;
})();
exports.InvoicesService = InvoicesService;
