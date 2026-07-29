'use client';

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { useCreateRazorpayOrder, useVerifyRazorpayPayment } from '@/domains/billing/hooks';

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

const RAZORPAY_CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript(): Promise<boolean> {
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

interface RazorpayCheckoutButtonProps {
  invoiceId: string;
  invoiceNumber: string;
  amountDue: number;
  clinicName?: string;
  patientName?: string;
  patientEmail?: string;
  className?: string;
  onPaymentSuccess?: () => void;
  onPaymentError?: (message: string) => void;
}

export function RazorpayCheckoutButton({
  invoiceId,
  invoiceNumber,
  amountDue,
  clinicName = 'Quravo Health',
  patientName,
  patientEmail,
  className,
  onPaymentSuccess,
  onPaymentError,
}: RazorpayCheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const createOrderMutation = useCreateRazorpayOrder();
  const verifyPaymentMutation = useVerifyRazorpayPayment();

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
          } catch (err: any) {
            onPaymentError?.(err.message || 'Payment verification failed.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });

      razorpay.open();
    } catch (err: any) {
      onPaymentError?.(err.message || 'Failed to start payment.');
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing || amountDue <= 0}
      className={
        className ||
        'w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50'
      }
    >
      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
      <span>{isProcessing ? 'Processing...' : `Pay Online ($${amountDue.toFixed(2)})`}</span>
    </button>
  );
}
