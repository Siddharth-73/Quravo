'use client';
import React from 'react';

export default function BillingPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Billing & Invoices</h1>
        <button className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-md font-medium text-sm">
          Create Invoice
        </button>
      </div>

      <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-12 text-center">
        <div className="text-slate-400 mb-2">No invoices found</div>
        <p className="text-sm text-slate-500">
          Get started by creating your first invoice for a patient.
        </p>
      </div>
    </div>
  );
}
