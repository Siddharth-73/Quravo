"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInvoices = useInvoices;
exports.useInvoice = useInvoice;
exports.useCreateInvoice = useCreateInvoice;
exports.useCreatePayment = useCreatePayment;
exports.useCreateRazorpayOrder = useCreateRazorpayOrder;
exports.useVerifyRazorpayPayment = useVerifyRazorpayPayment;
const react_query_1 = require("@tanstack/react-query");
const client_1 = require("@/lib/api/client");
const billing_1 = require("@/lib/query-keys/billing");
function useInvoices() {
    return (0, react_query_1.useQuery)({
        queryKey: billing_1.billingKeys.invoices(),
        queryFn: async () => (0, client_1.apiFetch)('/invoices'),
    });
}
function useInvoice(id) {
    return (0, react_query_1.useQuery)({
        queryKey: billing_1.billingKeys.invoice(id),
        queryFn: async () => (0, client_1.apiFetch)(`/invoices/${id}`),
        enabled: !!id,
    });
}
function useCreateInvoice() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)('/invoices', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billing_1.billingKeys.invoices() });
        },
    });
}
/** Manual/offline payment recording (cash, bank transfer, etc). */
function useCreatePayment() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)('/payments', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: billing_1.billingKeys.invoice(variables.invoiceId) });
            queryClient.invalidateQueries({ queryKey: billing_1.billingKeys.invoices() });
        },
    });
}
/** Step 1 of the Razorpay flow: ask the backend to create an Order for an invoice. */
function useCreateRazorpayOrder() {
    return (0, react_query_1.useMutation)({
        mutationFn: async (invoiceId) => {
            return await (0, client_1.apiFetch)('/payments/razorpay/order', {
                method: 'POST',
                body: JSON.stringify({ invoiceId }),
            });
        },
    });
}
/** Step 2 of the Razorpay flow: verify the signature Checkout.js returned. */
function useVerifyRazorpayPayment() {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: async (data) => {
            return await (0, client_1.apiFetch)('/payments/razorpay/verify', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: billing_1.billingKeys.invoice(variables.invoiceId) });
            queryClient.invalidateQueries({ queryKey: billing_1.billingKeys.invoices() });
        },
    });
}
