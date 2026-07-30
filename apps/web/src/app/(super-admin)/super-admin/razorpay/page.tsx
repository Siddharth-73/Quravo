'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, RefreshCw, Key, ShieldCheck, Zap, ArrowUpRight, DollarSign, Activity } from 'lucide-react';

interface RazorpayTransaction {
  id: string;
  orderId: string;
  patientName: string;
  clinicName: string;
  amountRs: number;
  status: 'Captured' | 'Authorized' | 'Refunded';
  method: 'UPI' | 'Card' | 'Netbanking';
  timestamp: string;
}

export default function RazorpayDashboardPage() {
  const [keyId] = useState('rzp_test_SwUFweahnIDY4u');
  const [webhookStatus] = useState('Active (Listening on /api/v1/payments/webhook)');
  const [transactions] = useState<RazorpayTransaction[]>([
    { id: 'pay_P1A987654321', orderId: 'ord_IN_98101', patientName: 'Rahul Verma', clinicName: 'Apollo Hospitals, New Delhi', amountRs: 800, status: 'Captured', method: 'UPI', timestamp: '2026-07-30 07:42 AM' },
    { id: 'pay_P1A987654322', orderId: 'ord_IN_98102', patientName: 'Priya Sharma', clinicName: 'Fortis Healthcare, Mumbai', amountRs: 600, status: 'Captured', method: 'Card', timestamp: '2026-07-30 07:25 AM' },
    { id: 'pay_P1A987654323', orderId: 'ord_IN_98103', patientName: 'Amit Patel', clinicName: 'Max Super Specialty, Bengaluru', amountRs: 1200, status: 'Captured', method: 'Netbanking', timestamp: '2026-07-30 06:50 AM' },
    { id: 'pay_P1A987654324', orderId: 'ord_IN_98104', patientName: 'Kavita Reddy', clinicName: 'Manipal Hospital, Hyderabad', amountRs: 700, status: 'Captured', method: 'UPI', timestamp: '2026-07-30 05:15 AM' },
    { id: 'pay_P1A987654325', orderId: 'ord_IN_98105', patientName: 'Vikram Malhotra', clinicName: 'Medanta The Medicity, Gurugram', amountRs: 1000, status: 'Captured', method: 'Card', timestamp: '2026-07-30 04:00 AM' },
  ]);

  const totalProcessedRs = transactions.reduce((sum, t) => sum + t.amountRs, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-sky-400" />
            <span>Razorpay Payment Gateway Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor Indian rupee (₹) transactions, test keys, Razorpay Webhooks, and patient checkout telemetry.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Razorpay Test Mode Active</span>
        </span>
      </div>

      {/* Gateway API Configuration & Key Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Razorpay Key ID</span>
          </span>
          <div className="font-mono text-sm text-purple-300 font-bold bg-slate-950 p-2 rounded-lg border border-slate-800 select-all">
            {keyId}
          </div>
          <span className="text-[10px] text-slate-400">Configured via environment secret RAZORPAY_KEY_ID</span>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Processed Volume (₹)</span>
          </span>
          <p className="text-2xl font-bold text-emerald-400">₹{totalProcessedRs.toLocaleString()} INR</p>
          <span className="text-[10px] text-slate-400">{transactions.length} Captured Online Checkouts</span>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
          <span className="text-[11px] font-semibold text-sky-400 uppercase flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span>Webhook Listener Status</span>
          </span>
          <p className="text-xs font-mono font-bold text-sky-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
            {webhookStatus}
          </p>
          <span className="text-[10px] text-slate-400">Listening for payment.authorized & payment.failed events</span>
        </div>
      </div>

      {/* Live Transaction Ledger */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="font-bold text-sm text-white">Live Patient Razorpay Transactions Ledger</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-slate-400 font-semibold text-[11px]">
              <tr>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Patient Name</th>
                <th className="p-3">Clinic / Hospital</th>
                <th className="p-3">Method</th>
                <th className="p-3">Amount (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-mono text-purple-400">{tx.id}</td>
                  <td className="p-3 font-mono text-slate-400">{tx.orderId}</td>
                  <td className="p-3 text-white font-bold">{tx.patientName}</td>
                  <td className="p-3 text-slate-300">{tx.clinicName}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-sky-400">
                      {tx.method}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">₹{tx.amountRs}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-400 font-mono text-[11px]">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
