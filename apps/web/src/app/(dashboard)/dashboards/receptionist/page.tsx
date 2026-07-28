"use client";

import React, { useState } from 'react';
import { UserPlus, Calendar, CreditCard, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ReceptionistDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Front Desk Receptionist Workspace</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage patient check-ins, walk-in registrations, and POS billing collection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/appointments"
            className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 shadow-sm"
          >
            Book Appointment
          </Link>
          <Link
            href="/billing"
            className="px-3.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-medium hover:bg-muted"
          >
            POS Billing Checkout
          </Link>
        </div>
      </div>

      {/* Front Desk Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Checked-In Patients</span>
          <div className="text-2xl font-bold text-emerald-500">8 Checked In</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Today's Total Billing</span>
          <div className="text-2xl font-bold text-foreground">$1,480.00</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Upcoming Slots Remaining</span>
          <div className="text-2xl font-bold text-primary">6 Slots</div>
        </div>
      </div>
    </div>
  );
}
