"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Receipt, Search, Loader2, X, Save, Trash2 } from 'lucide-react';
import { useInvoices, useCreateInvoice, CreateInvoiceItemInput } from '@/domains/billing/hooks';
import { usePatients } from '@/domains/patients/hooks';
import { useBranches } from '@/domains/clinic/hooks';

const emptyItem: CreateInvoiceItemInput = { description: '', quantity: 1, unitPrice: 0, taxRate: 0 };

function statusStyle(status: string) {
  if (status === 'paid') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
  if (status === 'partially_paid') return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
  if (status === 'cancelled' || status === 'voided') return 'bg-muted text-muted-foreground border-border';
  return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
}

export default function BillingPOSPage() {
  const { data: invoices = [], isLoading, isError } = useInvoices();
  const { data: patients = [] } = usePatients();
  const { data: branches = [] } = useBranches();
  const [search, setSearch] = useState('');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  const createInvoiceMutation = useCreateInvoice();

  const [form, setForm] = useState({
    patientId: '',
    branchId: '',
    dueDate: '',
    notes: '',
    items: [{ ...emptyItem }] as CreateInvoiceItemInput[],
  });

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const updateItem = (index: number, patch: Partial<CreateInvoiceItemInput>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { ...emptyItem }] }));
  const removeItem = (index: number) =>
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

  const resetForm = () =>
    setForm({ patientId: '', branchId: '', dueDate: '', notes: '', items: [{ ...emptyItem }] });

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvoiceMutation.mutateAsync({
        patientId: form.patientId,
        branchId: form.branchId,
        dueDate: form.dueDate || undefined,
        notes: form.notes || undefined,
        items: form.items.filter((item) => item.description && item.unitPrice >= 0),
      });
      setShowCreateInvoice(false);
      resetForm();
    } catch (e) {
      console.error(e);
    }
  };

  const estimatedTotal = form.items.reduce((sum, item) => {
    const lineSubtotal = item.quantity * item.unitPrice;
    return sum + lineSubtotal + lineSubtotal * ((item.taxRate || 0) / 100);
  }, 0);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing & Point-of-Sale (POS)</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Process patient consultation invoices, record payments, and collect online payments via Razorpay
          </p>
        </div>

        <button
          onClick={() => setShowCreateInvoice(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Invoice</span>
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-foreground">Clinic Invoices</h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice # or patient..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-muted/30 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="text-destructive text-sm text-center py-4">Failed to load invoices.</div>
        ) : (
          <>
            {filteredInvoices.map((inv) => (
              <Link
                key={inv.id}
                href={`/billing/${inv.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">{inv.invoiceNumber}</span>
                    <span className="text-xs font-bold text-foreground">{inv.patientName}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString() : '—'}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground font-mono">${parseFloat(inv.totalAmount).toFixed(2)}</div>
                    <div className="text-[10px] text-muted-foreground">Due: ${parseFloat(inv.amountDue).toFixed(2)}</div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border capitalize ${statusStyle(inv.status)}`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
            {filteredInvoices.length === 0 && <div className="text-muted-foreground text-sm text-center py-4">No invoices found.</div>}
          </>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Create New Invoice</h3>
              </div>
              <button onClick={() => setShowCreateInvoice(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Patient *</label>
                  <select
                    required
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Branch *</label>
                  <select
                    required
                    value={form.branchId}
                    onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                    className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select branch</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-foreground">Line Items *</label>
                  <button type="button" onClick={addItem} className="text-primary text-[11px] font-medium hover:underline">
                    + Add item
                  </button>
                </div>
                {form.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      required
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                      className="col-span-5 rounded-lg border border-border bg-muted/30 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="number"
                      min={1}
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                      className="col-span-2 rounded-lg border border-border bg-muted/30 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="Unit price"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className="col-span-2 rounded-lg border border-border bg-muted/30 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Tax %"
                      value={item.taxRate}
                      onChange={(e) => updateItem(index, { taxRate: parseFloat(e.target.value) || 0 })}
                      className="col-span-2 rounded-lg border border-border bg-muted/30 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={form.items.length === 1}
                      className="col-span-1 flex justify-center text-muted-foreground hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end text-[11px] text-muted-foreground pt-1">
                  Estimated total: <span className="font-mono font-semibold text-foreground ml-1">${estimatedTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateInvoice(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createInvoiceMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {createInvoiceMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Create Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
