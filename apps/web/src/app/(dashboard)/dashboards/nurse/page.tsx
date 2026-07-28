"use client";

import React, { useState } from 'react';
import { Activity, Heart, Thermometer, UserCheck, Bed, Plus } from 'lucide-react';

export default function NurseDashboardPage() {
  const [patients, setPatients] = useState([
    { name: 'Eleanor Vance', mrn: 'MRN-2026-001', bp: '122/81', temp: '100.2°F', hr: '78 bpm', status: 'Triage Complete' },
    { name: 'Marcus Aurelius', mrn: 'MRN-2026-002', bp: '145/92', temp: '98.6°F', hr: '84 bpm', status: 'Awaiting Vitals' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Nurse Triage & Patient Vitals Station</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Record patient vital signs, administer triage assessments, and monitor inpatient beds
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 shadow-sm">
          <Activity className="w-3.5 h-3.5" />
          <span>Record New Vitals</span>
        </button>
      </div>

      {/* Triage Status Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Patients in Triage Queue</span>
          <div className="text-2xl font-bold text-amber-500">5 Patients</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Inpatient Beds Occupied</span>
          <div className="text-2xl font-bold text-primary">18 / 24 Beds</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Stat Lab Alerts</span>
          <div className="text-2xl font-bold text-emerald-500">Normal</div>
        </div>
      </div>

      {/* Vitals Intake List */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <h3 className="font-semibold text-sm text-foreground border-b border-border pb-2">Active Patient Triage Vitals</h3>
        <div className="space-y-3">
          {patients.map((p) => (
            <div key={p.mrn} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/20 text-xs gap-4">
              <div>
                <div className="font-bold text-foreground">{p.name} <span className="font-mono text-muted-foreground">({p.mrn})</span></div>
                <div className="text-muted-foreground mt-0.5 font-mono">BP: {p.bp} | Temp: {p.temp} | HR: {p.hr}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {p.status}
                </span>
                <button className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted">
                  Update Vitals
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
