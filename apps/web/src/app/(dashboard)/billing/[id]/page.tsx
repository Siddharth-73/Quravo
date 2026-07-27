'use client';
import React from 'react';
import { useParams } from 'next/navigation';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice {invoiceId}</h1>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-medium text-sm">
          Record Payment
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 border border-slate-800 rounded-xl bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold mb-4">Line Items</h2>
          <div className="text-sm text-slate-400">Loading items...</div>
        </div>
        
        <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800">
              <span>Total Due:</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
