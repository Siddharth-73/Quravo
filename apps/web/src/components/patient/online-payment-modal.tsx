'use client';

import React, { useState } from 'react';

export function OnlinePaymentModal({
  amount,
  providerName,
  date,
  timeSlot,
  onClose,
  onSuccess,
}: {
  amount: number;
  providerName: string;
  date: string;
  timeSlot: string;
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}) {
  const [processing, setProcessing] = useState(false);

  const handleRazorpayTestPayment = () => {
    setProcessing(true);

    // Simulate Razorpay Checkout Gateway loading with test key rzp_test_SwUFweahnIDY4u
    setTimeout(() => {
      const mockPaymentId = `pay_razorpay_${Math.random().toString(36).substring(2, 10)}`;
      setProcessing(false);
      onSuccess(mockPaymentId);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 border border-slate-200">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💳</span>
            <h3 className="text-lg font-bold text-slate-900">Razorpay Secure Online Checkout</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
        </div>

        {/* Appointment Order Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Provider / Clinic</span>
            <span className="font-semibold text-slate-900">{providerName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Schedule Slot</span>
            <span className="font-semibold text-slate-900">{date} @ {timeSlot}</span>
          </div>
          <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200 font-bold text-base text-slate-900">
            <span>Amount Payable</span>
            <span className="text-indigo-600">${amount}</span>
          </div>
        </div>

        {/* Razorpay Test Key Info Badge */}
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-1">
          <p className="font-bold">🔒 Razorpay Test Gateway Active</p>
          <p className="text-[11px] text-amber-700">Key ID: rzp_test_SwUFweahnIDY4u</p>
        </div>

        {/* Payment Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRazorpayTestPayment}
            disabled={processing}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <span>⚡ Processing Razorpay Payment...</span>
            ) : (
              <span>Pay ${amount} via Razorpay Now</span>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
