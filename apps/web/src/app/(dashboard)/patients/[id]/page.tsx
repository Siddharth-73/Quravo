"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { User, Phone, Mail, Calendar, FileText, Activity, AlertTriangle, Pill, Plus, ArrowLeft, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params?.id || 'p-101';
  const [activeTab, setActiveTab] = useState<'timeline' | 'encounters' | 'prescriptions' | 'files'>('timeline');

  return (
    <div className="space-y-6">
      {/* Back Button & Patient Header Card */}
      <div className="space-y-4">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patient Directory</span>
        </Link>

        <div className="rounded-xl border border-border bg-card p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl shadow-inner shrink-0">
              EV
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">Eleanor Vance</h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  MRN-2026-001
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Active Patient
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span>Female, 34 yrs</span>
                <span>•</span>
                <span>DOB: 1992-04-12</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +1 (555) 234-5678</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> eleanor.vance@example.com</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/encounters/new?patientId=${patientId}`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Start SOAP Note</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Allergies & Vitals Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-rose-600 dark:text-rose-400">Known Allergies</div>
            <div className="text-foreground">Penicillin (Severe anaphylaxis), Latex</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
          <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-muted-foreground">Latest Vitals (2026-07-20)</div>
            <div className="text-foreground font-medium">BP: 120/80 mmHg • Pulse: 72 bpm • Temp: 98.6°F</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
          <Pill className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-muted-foreground">Active Medications</div>
            <div className="text-foreground font-medium">Amoxicillin 500mg, Lisinopril 10mg</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-3 text-xs">
        {[
          { id: 'timeline', label: 'Medical History Timeline', icon: Calendar },
          { id: 'encounters', label: 'SOAP Encounters (3)', icon: FileText },
          { id: 'prescriptions', label: 'Prescriptions (2)', icon: Pill },
          { id: 'files', label: 'Attachments & Reports (4)', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timeline View */}
      {activeTab === 'timeline' && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-xs">
          <h3 className="font-semibold text-sm text-foreground">Health Event Timeline</h3>
          <div className="relative pl-6 border-l-2 border-primary/30 space-y-6">
            <div className="relative">
              <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
              <div className="text-xs font-semibold text-foreground">Consultation & Routine Checkup</div>
              <div className="text-[11px] text-muted-foreground">2026-07-20 • Dr. Sarah Jenkins</div>
              <p className="text-xs text-foreground mt-1 bg-muted/30 p-3 rounded-lg border border-border">
                Patient presented with minor throat inflammation. Prescribed 5-day antibiotic course. Vitals within normal limits.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-background" />
              <div className="text-xs font-semibold text-foreground">Diagnostic Lab Test Report Attached</div>
              <div className="text-[11px] text-muted-foreground">2026-06-15 • City Diagnostic Lab</div>
              <p className="text-xs text-foreground mt-1 bg-muted/30 p-3 rounded-lg border border-border">
                Complete Blood Count (CBC) report uploaded. Hemoglobin: 14.2 g/dL. All markers within healthy ranges.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
