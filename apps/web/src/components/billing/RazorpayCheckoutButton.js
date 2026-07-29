"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayCheckoutButton = RazorpayCheckoutButton;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/billing/hooks");
const RAZORPAY_CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_SRC}"]`);
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(true));
            existingScript.addEventListener('error', () => resolve(false));
            return;
        }
        const script = document.createElement('script');
        script.src = RAZORPAY_CHECKOUT_SRC;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}
function RazorpayCheckoutButton({ invoiceId, invoiceNumber, amountDue, clinicName = 'Quravo Health', patientName, patientEmail, className, onPaymentSuccess, onPaymentError, }) {
    const [isProcessing, setIsProcessing] = (0, react_1.useState)(false);
    const createOrderMutation = (0, hooks_1.useCreateRazorpayOrder)();
    const verifyPaymentMutation = (0, hooks_1.useVerifyRazorpayPayment)();
    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded || !window.Razorpay) {
                onPaymentError?.('Failed to load Razorpay checkout. Check your connection and try again.');
                setIsProcessing(false);
                return;
            }
            const order = await createOrderMutation.mutateAsync(invoiceId);
            const razorpay = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: clinicName,
                description: `Invoice ${invoiceNumber}`,
                order_id: order.orderId,
                prefill: { name: patientName, email: patientEmail },
                theme: { color: '#0f172a' },
                handler: async (response) => {
                    try {
                        await verifyPaymentMutation.mutateAsync({
                            invoiceId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        onPaymentSuccess?.();
                    }
                    catch (err) {
                        onPaymentError?.(err.message || 'Payment verification failed.');
                    }
                    finally {
                        setIsProcessing(false);
                    }
                },
                modal: {
                    ondismiss: () => setIsProcessing(false),
                },
            });
            razorpay.open();
        }
        catch (err) {
            onPaymentError?.(err.message || 'Failed to start payment.');
            setIsProcessing(false);
        }
    };
    return (<button onClick={handlePayment} disabled={isProcessing || amountDue <= 0} className={className ||
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50'}>
      {isProcessing ? <lucide_react_1.Loader2 className="w-4 h-4 animate-spin"/> : <lucide_react_1.CreditCard className="w-4 h-4"/>}
      <span>{isProcessing ? 'Processing...' : `Pay Online ($${amountDue.toFixed(2)})`}</span>
    </button>);
}
