"use client";

import React, { useState } from 'react';
import { Stethoscope, Calendar, UserCheck, Sparkles, Clock, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Clinical Command Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Welcome back, Dr. Sarah Jenkins. Here is your clinical schedule & patient queue for today.
          </p>
        </div>

        <Link
          href="/encounters/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New SOAP Encounter</span>
        </Link>
      </div>

      {/* Clinical Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Today's Patients</span>
          <div className="text-2xl font-bold text-foreground">12 Scheduled</div>
          <span className="text-[11px] text-emerald-500">4 Completed, 8 Remaining</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Waiting Room Queue</span>
          <div className="text-2xl font-bold text-amber-500">3 Waiting</div>
          <span className="text-[11px] text-muted-foreground">Avg Wait: 12 mins</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Pending Lab Reports</span>
          <div className="text-2xl font-bold text-primary">5 Ready</div>
          <span className="text-[11px] text-muted-foreground">Require Clinical Sign-Off</span>
        </div>
      </div>

      {/* Active Patients Queue */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2">Waiting Room Clinical Queue</h3>
        <div className="space-y-3">
          {[
            { name: 'Eleanor Vance', mrn: 'MRN-2026-001', reason: 'Persistent Dry Cough & Fever', time: '10:30 AM', status: 'In Waiting Room' },
            { name: 'Marcus Aurelius', mrn: 'MRN-2026-002', reason: 'Hypertension Follow-Up', time: '11:00 AM', status: 'Scheduled' },
          ].map((p) => (
            <div key={p.mrn} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 text-xs">
              <div>
                <div className="font-bold text-foreground">{p.name} <span className="font-mono text-muted-foreground font-normal">({p.mrn})</span></div>
                <div className="text-muted-foreground mt-0.5">{p.reason}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-mono">{p.time}</span>
                <Link
                  href={`/encounters/new?patientId=${p.mrn}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                >
                  <span>Start SOAP Note</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
