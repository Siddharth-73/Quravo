'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useInvoice, useCreatePayment } from '@/domains/billing/hooks';
import { ArrowLeft, Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  
  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const createPaymentMutation = useCreatePayment();

  const handlePayment = async () => {
    if (!invoice) return;
    try {
      await createPaymentMutation.mutateAsync({ invoiceId, amount: invoice.amount });
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 space-y-4">
        <Link href="/billing" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Billing</span>
        </Link>
        <div className="text-muted-foreground">Invoice not found.</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <Link href="/billing" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Billing</span>
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold tracking-tight">Invoice {invoice.id}</h1>
           <p className="text-sm text-muted-foreground">Patient: {invoice.patientName}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
            invoice.status === 'Paid'
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
          }`}>
            {invoice.status}
          </span>
          {invoice.status !== 'Paid' && (
            <button
              onClick={handlePayment}
              disabled={createPaymentMutation.isPending}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50 transition-colors shadow-sm"
            >
              {createPaymentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              <span>{createPaymentMutation.isPending ? 'Processing...' : `Record Payment ($${invoice.amount.toFixed(2)})`}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border border-border rounded-xl bg-card p-6 shadow-xs">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Line Items</h2>
          <div className="text-sm text-foreground space-y-4">
             <div className="flex justify-between items-center p-3 rounded-lg border border-border bg-muted/20">
               <div>
                 <div className="font-medium">{invoice.items}</div>
                 <div className="text-xs text-muted-foreground mt-1">Rendered on {new Date(invoice.date).toLocaleDateString()}</div>
               </div>
               <div className="font-mono">${invoice.amount.toFixed(2)}</div>
             </div>
          </div>
        </div>
        
        <div className="border border-border rounded-xl bg-card p-6 shadow-xs h-fit">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Summary</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (0%):</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-foreground pt-3 border-t border-border text-base">
              <span>Total Due:</span>
              <span className="font-mono text-primary">${invoice.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

