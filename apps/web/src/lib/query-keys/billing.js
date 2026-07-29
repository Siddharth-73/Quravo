"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingKeys = void 0;
exports.billingKeys = {
    all: ['billing'],
    invoices: (filters) => [...exports.billingKeys.all, 'invoices', filters],
    invoice: (id) => [...exports.billingKeys.all, 'invoices', id],
    payments: (invoiceId) => [...exports.billingKeys.invoice(invoiceId), 'payments'],
};
