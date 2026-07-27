"use client";

import React, { useState } from 'react';
import { Stethoscope, User, Save, Sparkles, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';

export default function EncountersPage() {
  const [patientName, setPatientName] = useState('Eleanor Vance (MRN-2026-001)');
  const [subjective, setSubjective] = useState('Patient complains of persistent dry cough and mild fever for 3 days.');
  const [objective, setObjective] = useState('Temp: 100.2°F, BP: 122/81 mmHg, Pulse: 78 bpm. Throat displays mild erythema.');
  const [assessment, setAssessment] = useState('Acute Upper Respiratory Tract Infection (ICD-10: J06.9)');
  const [plan, setPlan] = useState('1. Rest & hydration\n2. Paracetamol 500mg as needed for fever\n3. Follow up in 5 days if symptoms worsen');

  const [aiLoading, setAiLoading] = useState(false);

  const handleAiAssist = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAssessment('Acute Viral Nasopharyngitis (ICD-10: J00) - AI Suggested Differential Diagnosis');
      setPlan((prev) => `${prev}\n4. AI Note: Consider saline nasal spray for congestion relief.`);
      setAiLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinical SOAP Note Editor</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Electronic Health Record encounter workspace with AI clinical assistance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAiAssist}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>{aiLoading ? 'Analyzing...' : 'AI Clinical Assist'}</span>
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
            <Save className="w-3.5 h-3.5" />
            <span>Sign & Finalize Encounter</span>
          </button>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">Encounter Patient:</span>
          <span className="text-muted-foreground font-medium">{patientName}</span>
        </div>
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" /> Encounter Date: 2026-07-27 (Today)
        </span>
      </div>

      {/* 4-Pane SOAP Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subjective */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">Subjective (S)</label>
            <span className="text-[10px] text-muted-foreground">Chief Complaints & History</span>
          </div>
          <textarea
            rows={5}
            value={subjective}
            onChange={(e) => setSubjective(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans leading-relaxed"
          />
        </div>

        {/* Objective */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-500">Objective (O)</label>
            <span className="text-[10px] text-muted-foreground">Vitals & Physical Examination</span>
          </div>
          <textarea
            rows={5}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-sans leading-relaxed"
          />
        </div>

        {/* Assessment */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-500">Assessment (A)</label>
            <span className="text-[10px] text-muted-foreground">Clinical Diagnoses (ICD-10)</span>
          </div>
          <textarea
            rows={5}
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-sans leading-relaxed"
          />
        </div>

        {/* Plan */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-500">Plan (P)</label>
            <span className="text-[10px] text-muted-foreground">Medications & Treatment Instructions</span>
          </div>
          <textarea
            rows={5}
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-sans leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
