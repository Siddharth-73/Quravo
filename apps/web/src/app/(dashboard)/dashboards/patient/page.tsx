"use client";

import React from 'react';
import { Calendar, Pill, FileText, Download, Plus, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PatientPortalDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Health & Appointments Portal</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Welcome back, Eleanor Vance. View your upcoming visits, active prescriptions, and lab test reports.
          </p>
        </div>

        <Link
          href="/book"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {/* Patient Portal Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Next Scheduled Visit</span>
          <div className="text-lg font-bold text-foreground">Tomorrow @ 10:30 AM</div>
          <span className="text-[11px] text-primary">Dr. Sarah Jenkins</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Active Prescriptions</span>
          <div className="text-lg font-bold text-foreground">Amoxicillin 500mg</div>
          <span className="text-[11px] text-muted-foreground">1 capsule 3x daily (2 days left)</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Lab Test Status</span>
          <div className="text-lg font-bold text-emerald-500">Blood Test Ready</div>
          <span className="text-[11px] text-muted-foreground">Report PDF available</span>
        </div>
      </div>

      {/* Downloadable Patient Reports */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
        <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2">Recent Medical Reports & Receipts</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
            <div>
              <div className="font-bold text-foreground">Complete Blood Count (CBC) Report</div>
              <div className="text-muted-foreground text-[11px]">Date: 2026-07-26 • Laboratory Diagnostics</div>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-muted">
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
