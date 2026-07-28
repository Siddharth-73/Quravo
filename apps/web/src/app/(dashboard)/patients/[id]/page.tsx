"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { User, Phone, Mail, Calendar, FileText, Activity, AlertTriangle, Pill, Plus, ArrowLeft, Stethoscope, Loader2, FileUp, Download } from 'lucide-react';
import Link from 'next/link';
import { usePatients, usePatientTimeline, usePatientAttachments, useUploadAttachment } from '@/domains/patients/hooks';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = Array.isArray(params?.id) ? params?.id[0] : params?.id || 'p-101';
  
  const [activeTab, setActiveTab] = useState<'timeline' | 'encounters' | 'prescriptions' | 'files'>('timeline');

  const { data: patientsList = [], isLoading: isLoadingPatients } = usePatients();
  const patient = patientsList.find(p => p.id === patientId);

  const { data: timelineEvents = [], isLoading: isLoadingTimeline } = usePatientTimeline(patientId);
  const { data: attachments = [], isLoading: isLoadingAttachments } = usePatientAttachments(patientId);
  const uploadAttachmentMutation = useUploadAttachment();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await uploadAttachmentMutation.mutateAsync({ patientId, file });
      } catch (err) {
        console.error("Failed to upload attachment", err);
      }
    }
  };

  if (isLoadingPatients) {
    return <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!patient) {
    return <div className="p-10 text-center text-muted-foreground">Patient not found.</div>;
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl shadow-inner shrink-0">
              {patient.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{patient.fullName}</h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {patient.mrn}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${patient.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
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
            <div className="font-semibold text-muted-foreground">Latest Vitals</div>
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
          { id: 'files', label: `Attachments (${attachments.length})`, icon: FileText },
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
          {isLoadingTimeline ? (
             <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="relative pl-6 border-l-2 border-primary/30 space-y-6">
              {timelineEvents.length > 0 ? timelineEvents.map(event => (
                <div key={event.id} className="relative">
                  <div className={`absolute -left-[31px] top-0 h-4 w-4 rounded-full ring-4 ring-background ${event.type === 'encounter' ? 'bg-primary' : event.type === 'lab' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
                  <div className="text-xs font-semibold text-foreground">{event.title}</div>
                  <div className="text-[11px] text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                  <p className="text-xs text-foreground mt-1 bg-muted/30 p-3 rounded-lg border border-border">
                    {event.description}
                  </p>
                </div>
              )) : (
                <div className="text-xs text-muted-foreground">No events in timeline.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Attachments View */}
      {activeTab === 'files' && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground">Clinical Attachments</h3>
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted cursor-pointer">
              {uploadAttachmentMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
              <span>{uploadAttachmentMutation.isPending ? 'Uploading...' : 'Upload File'}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploadAttachmentMutation.isPending} />
            </label>
          </div>
          
          {isLoadingAttachments ? (
             <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {attachments.length > 0 ? attachments.map(file => (
                <div key={file.id} className="p-4 rounded-xl border border-border bg-muted/20 flex items-start gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-foreground truncate">{file.fileName}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(file.uploadedAt).toLocaleDateString()} • {file.fileType}</div>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary mt-1 inline-flex items-center gap-1 font-semibold hover:underline mt-2">
                       <Download className="w-3 h-3" /> Download
                    </a>
                  </div>
                </div>
              )) : (
                <div className="text-xs text-muted-foreground col-span-full">No attachments found.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

