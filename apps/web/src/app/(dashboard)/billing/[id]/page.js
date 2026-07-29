"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InvoiceDetailsPage;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const hooks_1 = require("@/domains/billing/hooks");
const RazorpayCheckoutButton_1 = require("@/components/billing/RazorpayCheckoutButton");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const PAID_STATUSES = ['paid'];
function InvoiceDetailsPage() {
    const params = (0, navigation_1.useParams)();
    const invoiceId = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const { data: invoice, isLoading, refetch } = (0, hooks_1.useInvoice)(invoiceId);
    const createPaymentMutation = (0, hooks_1.useCreatePayment)();
    const [feedback, setFeedback] = (0, react_1.useState)(null);
    const handleRecordCashPayment = async () => {
        if (!invoice)
            return;
        setFeedback(null);
        try {
            await createPaymentMutation.mutateAsync({
                invoiceId: invoice.id,
                amount: parseFloat(invoice.amountDue),
                paymentMethod: 'cash',
            });
            setFeedback({ type: 'success', text: 'Cash payment recorded.' });
        }
        catch (e) {
            setFeedback({ type: 'error', text: e.message || 'Failed to record payment.' });
        }
    };
    if (isLoading) {
        return (<div className="p-10 flex justify-center items-center h-[50vh]">
        <lucide_react_1.Loader2 className="w-8 h-8 animate-spin text-primary"/>
      </div>);
    }
    if (!invoice) {
        return (<div className="p-8 space-y-4">
        <link_1.default href="/billing" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium">
          <lucide_react_1.ArrowLeft className="w-3.5 h-3.5"/>
          <span>Back to Billing</span>
        </link_1.default>
        <div className="text-muted-foreground">Invoice not found.</div>
      </div>);
    }
    const amountDue = parseFloat(invoice.amountDue);
    const isPaid = PAID_STATUSES.includes(invoice.status);
    return (<div className="p-8 max-w-5xl space-y-6">
      <link_1.default href="/billing" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium">
        <lucide_react_1.ArrowLeft className="w-3.5 h-3.5"/>
        <span>Back to Billing</span>
      </link_1.default>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h1>
          <p className="text-sm text-muted-foreground">Patient: {invoice.patientName}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border capitalize ${isPaid
            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
          {invoice.status.replace('_', ' ')}
        </span>
      </div>

      {feedback && (<div className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
          {feedback.type === 'success' ? <lucide_react_1.CheckCircle2 className="w-4 h-4"/> : <lucide_react_1.AlertCircle className="w-4 h-4"/>}
          {feedback.text}
        </div>)}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border border-border rounded-xl bg-card p-6 shadow-xs">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Line Items</h2>
          <div className="text-sm text-foreground space-y-3">
            {invoice.items && invoice.items.length > 0 ? (invoice.items.map((item) => (<div key={item.id} className="flex justify-between items-center p-3 rounded-lg border border-border bg-muted/20">
                  <div>
                    <div className="font-medium">{item.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Qty {item.quantity} &times; ${parseFloat(item.unitPrice).toFixed(2)}
                      {parseFloat(item.taxRate) > 0 && ` (+${item.taxRate}% tax)`}
                    </div>
                  </div>
                  <div className="font-mono">${parseFloat(item.total).toFixed(2)}</div>
                </div>))) : (<div className="text-muted-foreground text-xs">No line items.</div>)}
          </div>
        </div>

        <div className="border border-border rounded-xl bg-card p-6 shadow-xs h-fit space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Summary</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${parseFloat(invoice.taxAmount).toFixed(2)}</span>
            </div>
            {parseFloat(invoice.discountAmount) > 0 && (<div className="flex justify-between">
                <span>Discount:</span>
                <span>-${parseFloat(invoice.discountAmount).toFixed(2)}</span>
              </div>)}
            <div className="flex justify-between font-bold text-foreground pt-3 border-t border-border text-base">
              <span>Amount Due:</span>
              <span className="font-mono text-primary">${amountDue.toFixed(2)}</span>
            </div>
          </div>

          {!isPaid && (<div className="space-y-2 pt-2 border-t border-border">
              <RazorpayCheckoutButton_1.RazorpayCheckoutButton invoiceId={invoice.id} invoiceNumber={invoice.invoiceNumber} amountDue={amountDue} patientName={invoice.patientName} onPaymentSuccess={() => {
                setFeedback({ type: 'success', text: 'Payment received via Razorpay.' });
                refetch();
            }} onPaymentError={(msg) => setFeedback({ type: 'error', text: msg })}/>
              <button onClick={handleRecordCashPayment} disabled={createPaymentMutation.isPending} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border bg-card text-foreground font-medium text-xs hover:bg-muted transition-colors disabled:opacity-50">
                {createPaymentMutation.isPending ? <lucide_react_1.Loader2 className="w-4 h-4 animate-spin"/> : <lucide_react_1.Banknote className="w-4 h-4"/>}
                <span>Record Cash Payment</span>
              </button>
            </div>)}
        </div>
      </div>
    </div>);
}
