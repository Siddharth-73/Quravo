"use client";

import React from 'react';
import { Stethoscope, Calendar, UserCheck, Sparkles, Clock, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAppointments } from '@/domains/appointments/hooks';
import { usePatients } from '@/domains/patients/hooks';

export default function DoctorDashboardPage() {
  const { data: appointmentsList = [] } = useAppointments();
  const { data: patientsList = [] } = usePatients();

  const fallbackPatients = [
    { name: 'Priya Patel', mrn: 'MRN-2026-001', reason: 'Persistent Dry Cough & Fever', time: '10:30 AM', status: 'In Waiting Room' },
    { name: 'Rahul Verma', mrn: 'MRN-2026-002', reason: 'Hypertension Routine Follow-Up', time: '11:00 AM', status: 'Scheduled' },
    { name: 'Aarav Mehta', mrn: 'MRN-2026-003', reason: 'Pediatric Health Checkup', time: '11:30 AM', status: 'Scheduled' },
  ];

  const queueData = appointmentsList.length > 0
    ? appointmentsList.map((apt: any) => ({
        name: apt.patientName || apt.patientLabel || 'Patient',
        mrn: apt.patientId || apt.id || 'MRN-2026-001',
        reason: apt.type || apt.reason || 'General Consultation',
        time: apt.time || apt.startTime || '10:00 AM',
        status: apt.status || 'Scheduled',
      }))
    : fallbackPatients;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Clinical Command Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Welcome back, Dr. Siddharth Sharma. Here is your clinical schedule & patient queue for today.
          </p>
        </div>

        <Link
          href="/encounters/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Gemini SOAP Scribe</span>
        </Link>
      </div>

      {/* Clinical Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Today's Patients</span>
          <div className="text-2xl font-bold text-foreground">{queueData.length} Scheduled</div>
          <span className="text-[11px] text-emerald-500">Live Clinical Intake</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs">
          <span className="text-xs text-muted-foreground">Waiting Room Queue</span>
          <div className="text-2xl font-bold text-amber-500">{queueData.filter(q => q.status !== 'Completed').length} Waiting</div>
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
          {queueData.map((p) => (
            <div key={p.mrn + p.time} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 text-xs">
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
                  <span>Start Gemini SOAP Scribe</span>
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
