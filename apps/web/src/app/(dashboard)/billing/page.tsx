"use client";

import React, { useState } from 'react';
import { CreditCard, DollarSign, Plus, Printer, CheckCircle2, Receipt, Search, Loader2 } from 'lucide-react';
import { useInvoices, useCreatePayment, Invoice } from '@/domains/billing/hooks';

export default function BillingPOSPage() {
  const { data: invoices = [], isLoading } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const createPaymentMutation = useCreatePayment();

  // Keep selected invoice in sync if it updates
  const activeInvoice = selectedInvoice ? invoices.find(inv => inv.id === selectedInvoice.id) || selectedInvoice : null;

  const handlePay = async (id: string) => {
    if (!activeInvoice) return;
    try {
      await createPaymentMutation.mutateAsync({ invoiceId: id, amount: activeInvoice.amount });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing & Point-of-Sale (POS)</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Process patient consultation invoices, record payments, and print digital receipts
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoices List */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
          <h3 className="font-semibold text-sm text-foreground mb-2">Clinic Invoices</h3>
          {isLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <>
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                    activeInvoice?.id === inv.id
                      ? 'border-primary bg-primary/5 shadow-xs'
                      : 'border-border bg-muted/20 hover:bg-muted/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{inv.id}</span>
                      <span className="text-xs font-bold text-foreground">{inv.patientName}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{inv.items}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground font-mono">${inv.amount.toFixed(2)}</div>
                      <div className="text-[10px] text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && <div className="text-muted-foreground text-sm text-center py-4">No invoices found.</div>}
            </>
          )}
        </div>

        {/* Selected Invoice Receipt Terminal */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between h-full space-y-4">
          {activeInvoice ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">Checkout Receipt</h3>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{activeInvoice.id}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-medium text-foreground">{activeInvoice.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium text-foreground text-right">{activeInvoice.items}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
                  <span>Total Amount Due:</span>
                  <span className="text-primary font-mono">${activeInvoice.amount.toFixed(2)}</span>
                </div>
              </div>

              {activeInvoice.status === 'Unpaid' ? (
                <button
                  onClick={() => handlePay(activeInvoice.id)}
                  disabled={createPaymentMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {createPaymentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  <span>{createPaymentMutation.isPending ? 'Processing...' : `Collect Payment ($${activeInvoice.amount.toFixed(2)})`}</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-center text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment Received</span>
                  </div>
                  <button
                    onClick={() => alert(`Printing receipt for ${activeInvoice.id}`)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-xs text-muted-foreground">
              <Receipt className="w-8 h-8 opacity-30 mb-2" />
              <span>Select an invoice from the list to view receipt or process payment.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
