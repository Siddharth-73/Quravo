import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { billingKeys } from '@/lib/query-keys/billing';

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'partially_paid' | 'cancelled' | 'voided';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: string;
  taxRate: string;
  total: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  branchId: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  totalAmount: string;
  amountDue: string;
  dueDate: string | null;
  issuedAt: string | null;
  notes: string | null;
  createdAt: string;
  items?: InvoiceItem[];
}

export interface CreateInvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
}

export interface CreateInvoiceInput {
  branchId: string;
  patientId: string;
  dueDate?: string;
  notes?: string;
  items: CreateInvoiceItemInput[];
}

export function useInvoices() {
  return useQuery({
    queryKey: billingKeys.invoices(),
    queryFn: async () => apiFetch<Invoice[]>('/invoices'),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: billingKeys.invoice(id),
    queryFn: async () => apiFetch<Invoice>(`/invoices/${id}`),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateInvoiceInput) => {
      return await apiFetch<Invoice>('/invoices', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.invoices() });
    },
  });
}

/** Manual/offline payment recording (cash, bank transfer, etc). */
export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      invoiceId: string;
      amount: number;
      paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'online_gateway';
      transactionId?: string;
      notes?: string;
    }) => {
      return await apiFetch<{ id: string }>('/payments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.invoice(variables.invoiceId) });
      queryClient.invalidateQueries({ queryKey: billingKeys.invoices() });
    },
  });
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number; // paise
  currency: string;
  keyId: string;
  invoiceId: string;
}

/** Step 1 of the Razorpay flow: ask the backend to create an Order for an invoice. */
export function useCreateRazorpayOrder() {
  return useMutation({
    mutationFn: async (invoiceId: string) => {
      return await apiFetch<RazorpayOrderResponse>('/payments/razorpay/order', {
        method: 'POST',
        body: JSON.stringify({ invoiceId }),
      });
    },
  });
}

/** Step 2 of the Razorpay flow: verify the signature Checkout.js returned. */
export function useVerifyRazorpayPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      invoiceId: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }) => {
      return await apiFetch<{ id: string; status: string }>('/payments/razorpay/verify', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.invoice(variables.invoiceId) });
      queryClient.invalidateQueries({ queryKey: billingKeys.invoices() });
    },
  });
}
