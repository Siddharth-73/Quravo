"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { User, Phone, Mail, Calendar, FileText, Activity, AlertTriangle, Pill, Plus, ArrowLeft, Stethoscope, Loader2, FileUp, Download } from 'lucide-react';
import Link from 'next/link';
import { usePatients, usePatientTimeline, usePatientAttachments, useUploadAttachment, Patient } from '@/domains/patients/hooks';

const PATIENTS_MAP: Record<string, Patient> = {
  'p-101': { id: 'p-101', tenantId: 't-1', mrn: 'MRN-IN-1001', fullName: 'Rahul Verma', gender: 'Male', age: 38, phone: '+91 98112 34567', email: 'rahul.verma@example.com', status: 'Active', createdAt: '2026-01-15' },
  'p-102': { id: 'p-102', tenantId: 't-1', mrn: 'MRN-IN-1002', fullName: 'Priya Patel', gender: 'Female', age: 34, phone: '+91 98221 87654', email: 'priya.patel@example.com', status: 'Active', createdAt: '2026-02-10' },
  'p-103': { id: 'p-103', tenantId: 't-1', mrn: 'MRN-IN-1003', fullName: 'Aarav Mehta', gender: 'Male', age: 11, phone: '+91 98334 11223', email: 'parent.mehta@example.com', status: 'Active', createdAt: '2026-03-01' },
  'p-104': { id: 'p-104', tenantId: 't-1', mrn: 'MRN-IN-1004', fullName: 'Sunita Gupta', gender: 'Female', age: 51, phone: '+91 98445 66778', email: 'sunita.gupta@example.com', status: 'Active', createdAt: '2026-03-18' },
  'p-105': { id: 'p-105', tenantId: 't-1', mrn: 'MRN-IN-1005', fullName: 'Rajesh Kumar', gender: 'Male', age: 46, phone: '+91 98556 99001', email: 'rajesh.kumar@example.com', status: 'Active', createdAt: '2026-04-05' },
};

const DEFAULT_TIMELINE = [
  { id: 'ev-1', type: 'encounter', title: 'SOAP Consultation — Acute URTI', date: '2026-07-30', description: 'Patient presented with 3-day dry cough & fever. Prescribed Paracetamol 650mg & Pantoprazole 40mg.' },
  { id: 'ev-2', type: 'lab', title: 'Lab Order — Complete Blood Count (CBC)', date: '2026-07-28', description: 'Diagnostic lab report uploaded. Hemoglobin: 14.2 g/dL, WBC: 7,800/mcL (Normal).' },
  { id: 'ev-3', type: 'prescription', title: 'E-Prescription Dispensed', date: '2026-07-25', description: 'Pharmacy dispensed Telmisartan 40mg (30 Tablets).' },
];

const DEFAULT_ATTACHMENTS = [
  { id: 'att-1', fileName: 'CBC_Diagnostic_Lab_Report.pdf', uploadedAt: '2026-07-28', fileType: 'application/pdf', url: '#' },
  { id: 'att-2', fileName: 'Chest_XRay_Digital_Scan.png', uploadedAt: '2026-07-20', fileType: 'image/png', url: '#' },
];

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = Array.isArray(params?.id) ? params?.id[0] : params?.id || 'p-101';

  const [activeTab, setActiveTab] = useState<'timeline' | 'files'>('timeline');

  const { data: dbPatients = [], isLoading: isLoadingPatients } = usePatients();
  const foundInDb = dbPatients.find((p) => p.id === patientId);
  const patient = foundInDb || PATIENTS_MAP[patientId] || PATIENTS_MAP['p-101'];

  const { data: dbTimeline = [] } = usePatientTimeline(patientId);
  const timelineEvents = dbTimeline.length > 0 ? dbTimeline : DEFAULT_TIMELINE;

  const { data: dbAttachments = [] } = usePatientAttachments(patientId);
  const attachments = dbAttachments.length > 0 ? dbAttachments : DEFAULT_ATTACHMENTS;

  const uploadAttachmentMutation = useUploadAttachment();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await uploadAttachmentMutation.mutateAsync({ patientId, file });
      } catch (err) {
        console.error('Failed to upload attachment', err);
      }
    }
  };

  if (isLoadingPatients && !patient) {
    return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl shadow-inner shrink-0 border border-primary/20">
              {patient.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{patient.fullName}</h1>
                <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {patient.mrn}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  {patient.status} Patient
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span>{patient.gender}, {patient.age} yrs</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {patient.phone}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {patient.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/encounters/new?patientId=${patientId}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Start Gemini SOAP Scribe</span>
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
            <div className="font-semibold text-muted-foreground">Latest Vitals Telemetry</div>
            <div className="text-foreground font-mono font-medium">BP: 124/82 mmHg • Pulse: 76 bpm • Temp: 98.6°F</div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
          <Pill className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-semibold text-muted-foreground">Active Medications</div>
            <div className="text-foreground font-medium">Paracetamol 650mg, Telmisartan 40mg</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-3 text-xs">
        {[
          { id: 'timeline', label: 'Medical History Timeline', icon: Calendar },
          { id: 'files', label: `EHR Attachments (${attachments.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
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
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative">
                <div
                  className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full ring-4 ring-background ${
                    event.type === 'encounter' ? 'bg-primary' : event.type === 'lab' ? 'bg-emerald-500' : 'bg-purple-500'
                  }`}
                />
                <div className="text-xs font-bold text-foreground">{event.title}</div>
                <div className="text-[11px] text-muted-foreground font-mono">{event.date}</div>
                <p className="text-xs text-foreground mt-1 bg-muted/30 p-3 rounded-lg border border-border">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments View */}
      {activeTab === 'files' && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground">Clinical EHR Attachments</h3>
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted cursor-pointer">
              {uploadAttachmentMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
              <span>{uploadAttachmentMutation.isPending ? 'Uploading...' : 'Upload Attachment'}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploadAttachmentMutation.isPending} />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {attachments.map((file) => (
              <div key={file.id} className="p-4 rounded-xl border border-border bg-muted/20 flex items-start gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-foreground truncate">{file.fileName}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{file.uploadedAt} • {file.fileType}</div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary inline-flex items-center gap-1 font-semibold hover:underline mt-2"
                  >
                    <Download className="w-3 h-3" /> Download Report
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
