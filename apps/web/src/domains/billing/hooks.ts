import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api/client';
import { billingKeys } from '@/lib/query-keys/billing';

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  date: string;
  items: string;
}

export function useInvoices(filters: Record<string, any> = {}) {
  return useQuery({
    queryKey: billingKeys.invoices(filters),
    queryFn: async () => {
      try {
        const params = new URLSearchParams(filters as Record<string, string>).toString();
        return await apiFetch<Invoice[]>(`/billing/invoices?${params}`);
      } catch (error) {
        // Mock data fallback
        return [
          { id: 'INV-2026-001', patientId: 'p-101', patientName: 'Eleanor Vance', amount: 150.00, status: 'Paid', date: '2026-07-27', items: 'General Consultation + Antibiotic Rx' },
          { id: 'INV-2026-002', patientId: 'p-102', patientName: 'Marcus Aurelius', amount: 280.00, status: 'Unpaid', date: '2026-07-27', items: 'Cardiology Assessment + ECG' },
          { id: 'INV-2026-003', patientId: 'p-103', patientName: 'Sophia Lin', amount: 95.00, status: 'Paid', date: '2026-07-26', items: 'Blood Test Diagnostics' },
        ] as Invoice[];
      }
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: billingKeys.invoice(id),
    queryFn: async () => {
      return await apiFetch<Invoice>(`/billing/invoices/${id}`);
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Invoice>) => {
      return await apiFetch<Invoice>('/billing/invoices', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.invoices() });
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ invoiceId, amount }: { invoiceId: string; amount: number }) => {
      return await apiFetch<{ success: boolean; invoice: Invoice }>(`/billing/invoices/${invoiceId}/payments`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.invoice(variables.invoiceId) });
      queryClient.invalidateQueries({ queryKey: billingKeys.invoices() });
    },
  });
}
