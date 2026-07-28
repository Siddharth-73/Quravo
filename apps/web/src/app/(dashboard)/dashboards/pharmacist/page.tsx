"use client";

import React from 'react';
import { Pill, PackageCheck, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PharmacistDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pharmacy & Stock Fulfillment Console</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Process doctor prescriptions, verify medication inventory, and dispense orders
          </p>
        </div>

        <Link
          href="/pharmacy"
          className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 shadow-sm"
        >
          Open Fulfillment Queue
        </Link>
      </div>

      {/* Pharmacy Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Pending Prescriptions</span>
          <div className="text-2xl font-bold text-amber-500">4 Orders</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Dispensed Today</span>
          <div className="text-2xl font-bold text-emerald-500">28 Rx Units</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Low Stock Warnings</span>
          <div className="text-2xl font-bold text-rose-500">2 Items</div>
        </div>
      </div>
    </div>
  );
}
