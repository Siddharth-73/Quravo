export const billingKeys = {
  all: ['billing'] as const,
  invoices: (filters?: Record<string, any>) => [...billingKeys.all, 'invoices', filters] as const,
  invoice: (id: string) => [...billingKeys.all, 'invoices', id] as const,
  payments: (invoiceId: string) => [...billingKeys.invoice(invoiceId), 'payments'] as const,
};
