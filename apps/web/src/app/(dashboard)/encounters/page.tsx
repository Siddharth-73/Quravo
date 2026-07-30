"use client";

import React, { useState } from 'react';
import {
  Stethoscope,
  User,
  Plus,
  Clock,
  Loader2,
  Sparkles,
  FileText,
  Search,
  X,
  Pill,
  CheckCircle2,
  Eye,
  Bot,
} from 'lucide-react';
import Link from 'next/link';
import { useEncounters } from '@/domains/emr/hooks';

interface SoapEncounterRecord {
  id: string;
  date: string;
  patientName: string;
  mrn: string;
  doctorName: string;
  chiefComplaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  prescriptions: { med: string; dose: string }[];
  status: 'Signed' | 'Final' | 'Draft';
}

const DETAILED_SOAP_ENCOUNTERS: SoapEncounterRecord[] = [
  {
    id: 'enc-101',
    date: '2026-07-30',
    patientName: 'Rahul Verma',
    mrn: 'MRN-IN-1001',
    doctorName: 'Dr. Suresh Reddy',
    chiefComplaint: 'Acute Upper Respiratory Tract Infection & Mild Pyrexia',
    subjective: 'Patient reports persistent dry cough for 3 days, accompanied by throat irritation and low-grade fever (100.2°F). Denies shortness of breath, chest pain, or hemoptysis.',
    objective: 'Vitals: BP 124/82 mmHg, Temp 100.2°F, HR 76 bpm, SpO2 99%. Pharyngeal erythema present. Lungs clear to auscultation bilaterally.',
    assessment: 'Acute Upper Respiratory Tract Infection (ICD-10: J06.9) / Mild Pyrexia.',
    plan: '1. Tab Paracetamol 650mg 1-0-1 for 5 days\n2. Tab Pantoprazole 40mg 1-0-0\n3. Warm saline gargles thrice daily\n4. Follow-up in 5 days if fever persists.',
    prescriptions: [
      { med: 'Paracetamol 650mg', dose: '1-0-1 (5 Days)' },
      { med: 'Pantoprazole 40mg', dose: '1-0-0 (7 Days)' },
    ],
    status: 'Signed',
  },
  {
    id: 'enc-102',
    date: '2026-07-29',
    patientName: 'Priya Patel',
    mrn: 'MRN-IN-1002',
    doctorName: 'Dr. Ananya Iyer',
    chiefComplaint: 'Viral Pyrexia & High Grade Fever Intake',
    subjective: 'Patient presents with high fever (101.4°F) for 2 days, associated with severe body ache, myalgia, and fatigue. No vomiting or diarrhea.',
    objective: 'Vitals: BP 142/94 mmHg, Temp 101.4°F, HR 92 bpm, SpO2 97%. Soft abdomen, non-tender. Mild conjunctival suffusion.',
    assessment: 'Viral Pyrexia / Suspected Seasonal Viral Fever (ICD-10: R50.9).',
    plan: '1. Tab Paracetamol 650mg SOS for fever > 100°F\n2. Stat blood samples for Dengue NS1 & CRP\n3. Increase oral fluid intake (3L/day).',
    prescriptions: [
      { med: 'Paracetamol 650mg', dose: '1-1-1 (3 Days)' },
      { med: 'ORS Electrolyte Sachet', dose: '2 sachets/day' },
    ],
    status: 'Signed',
  },
  {
    id: 'enc-103',
    date: '2026-07-28',
    patientName: 'Sunita Gupta',
    mrn: 'MRN-IN-1004',
    doctorName: 'Dr. Rajesh Kumar',
    chiefComplaint: 'Type-2 Diabetes Mellitus Routine Follow-Up',
    subjective: 'Patient returns for 3-month diabetes review. Reports good adherence to diet and medication. No hypoglycemic episodes, numbness, or visual complaints.',
    objective: 'Vitals: BP 130/85 mmHg, Temp 99.1°F, HR 82 bpm, SpO2 98%. Fasting Blood Sugar: 128 mg/dL, HbA1c: 6.8%. Foot exam normal.',
    assessment: 'Type-2 Diabetes Mellitus under fair glycemic control (ICD-10: E11.9).',
    plan: '1. Continue Tab Metformin 500mg SR BD\n2. Continue diabetic diet & 30-min morning walk\n3. Repeat HbA1c in 3 months.',
    prescriptions: [
      { med: 'Metformin 500mg SR', dose: '1-0-1 (30 Days)' },
    ],
    status: 'Final',
  },
];

import { useAuth } from '@/providers/AuthProvider';

export default function EncountersPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEncounter, setSelectedEncounter] = useState<SoapEncounterRecord | null>(null);

  const isPatient = (user?.role || '').toLowerCase().includes('patient');
  const patientFullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Rahul Verma';

  const filteredEncounters = DETAILED_SOAP_ENCOUNTERS.filter((e) => {
    if (isPatient && !e.patientName.toLowerCase().includes(patientFullName.toLowerCase())) {
      return false;
    }
    return (
      e.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });


  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span>SOAP Clinical Encounters Directory</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Inspect, author, and review Subjective, Objective, Assessment, and Plan (SOAP) clinical records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/encounters/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Gemini SOAP Scribe</span>
          </Link>
        </div>
      </div>

      {/* Search Bar & Controls */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search encounter by patient, MRN, or complaint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
            />
          </div>

          <span className="text-xs text-muted-foreground font-medium">
            Showing {filteredEncounters.length} SOAP Encounters
          </span>
        </div>

        {/* Encounters List Cards */}
        <div className="space-y-3">
          {filteredEncounters.map((enc) => (
            <div
              key={enc.id}
              onClick={() => setSelectedEncounter(enc)}
              className="group cursor-pointer rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                    {enc.patientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      {enc.patientName}
                      <span className="font-mono text-[11px] text-muted-foreground font-normal">({enc.mrn})</span>
                    </h3>
                    <span className="text-[11px] text-muted-foreground font-medium">Attending: {enc.doctorName} • Date: {enc.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {enc.status}
                  </span>

                  <button className="flex items-center gap-1 px-3 py-1 rounded-lg border border-border bg-card text-xs font-semibold text-foreground group-hover:bg-muted transition-colors">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span>View Full SOAP</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-foreground">Chief Complaint: </span>
                <span className="text-xs text-muted-foreground font-medium">{enc.chiefComplaint}</span>
              </div>

              {/* SOAP Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="rounded-lg bg-muted/40 p-2 border border-border/40">
                  <span className="text-[10px] font-bold text-primary block">Subjective (S)</span>
                  <span className="text-muted-foreground line-clamp-1">{enc.subjective}</span>
                </div>
                <div className="rounded-lg bg-muted/40 p-2 border border-border/40">
                  <span className="text-[10px] font-bold text-emerald-500 block">Objective (O)</span>
                  <span className="text-muted-foreground line-clamp-1">{enc.objective}</span>
                </div>
                <div className="rounded-lg bg-muted/40 p-2 border border-border/40">
                  <span className="text-[10px] font-bold text-amber-500 block">Assessment (A)</span>
                  <span className="text-muted-foreground line-clamp-1">{enc.assessment}</span>
                </div>
                <div className="rounded-lg bg-muted/40 p-2 border border-border/40">
                  <span className="text-[10px] font-bold text-purple-500 block">Plan (P)</span>
                  <span className="text-muted-foreground line-clamp-1">{enc.plan}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full SOAP Clinical Note Inspector Modal */}
      {selectedEncounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <span>Clinical SOAP Encounter Record</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Patient: <span className="font-bold text-foreground">{selectedEncounter.patientName}</span> ({selectedEncounter.mrn}) • {selectedEncounter.date}
                </p>
              </div>

              <button
                onClick={() => setSelectedEncounter(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* SOAP Content Blocks */}
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-1">
                <h4 className="font-bold text-primary text-xs uppercase tracking-wider">Subjective (S)</h4>
                <p className="text-foreground leading-relaxed font-medium">{selectedEncounter.subjective}</p>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
                <h4 className="font-bold text-emerald-500 text-xs uppercase tracking-wider">Objective (O)</h4>
                <p className="text-foreground leading-relaxed font-medium">{selectedEncounter.objective}</p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1">
                <h4 className="font-bold text-amber-500 text-xs uppercase tracking-wider">Assessment & ICD-10 (A)</h4>
                <p className="text-foreground leading-relaxed font-semibold">{selectedEncounter.assessment}</p>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-1">
                <h4 className="font-bold text-purple-500 text-xs uppercase tracking-wider">Plan & Advice (P)</h4>
                <p className="text-foreground leading-relaxed font-medium whitespace-pre-line">{selectedEncounter.plan}</p>
              </div>

              {/* Prescribed Rx */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-500" />
                  <span>Prescribed Electronic Medication (Rx)</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedEncounter.prescriptions.map((rx, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-card border border-border text-xs">
                      <span className="font-bold text-foreground">{rx.med}</span>
                      <span className="font-mono text-muted-foreground">{rx.dose}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-[11px] text-muted-foreground font-mono">Attending Physician: {selectedEncounter.doctorName}</span>
              <button
                onClick={() => setSelectedEncounter(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90"
              >
                Close Encounter View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
