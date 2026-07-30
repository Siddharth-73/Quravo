"use client";

import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  UserCheck,
  Sparkles,
  Clock,
  Plus,
  ArrowRight,
  Pill,
  FileText,
  TestTube,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Bot,
  Activity,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import { useAppointments } from '@/domains/appointments/hooks';
import { usePatients } from '@/domains/patients/hooks';
import { useAuth } from '@/providers/AuthProvider';
import { useTenant } from '@/providers/TenantProvider';

interface DoctorPatientQueueItem {
  id: string;
  name: string;
  mrn: string;
  age: number;
  gender: string;
  reason: string;
  bp: string;
  temp: string;
  time: string;
  status: 'In Waiting Room' | 'Consultation In Progress' | 'Completed Today';
  vitals: { bp: string; temp: string; hr: string; spo2: string };
}

const INITIAL_CLINICAL_QUEUE: DoctorPatientQueueItem[] = [
  {
    id: 'p-101',
    name: 'Rahul Verma',
    mrn: 'MRN-IN-1001',
    age: 38,
    gender: 'Male',
    reason: 'Hypertension Follow-Up & Persistent Dry Cough',
    bp: '124/82',
    temp: '98.6°F',
    time: '10:30 AM',
    status: 'In Waiting Room',
    vitals: { bp: '124/82', temp: '98.6°F', hr: '76 bpm', spo2: '99%' },
  },
  {
    id: 'p-102',
    name: 'Priya Patel',
    mrn: 'MRN-IN-1002',
    age: 34,
    gender: 'Female',
    reason: 'High Grade Fever (101.4°F) & Severe Body Aches',
    bp: '142/94',
    temp: '101.4°F',
    time: '11:00 AM',
    status: 'In Waiting Room',
    vitals: { bp: '142/94', temp: '101.4°F', hr: '92 bpm', spo2: '97%' },
  },
  {
    id: 'p-103',
    name: 'Sunita Gupta',
    mrn: 'MRN-IN-1004',
    age: 51,
    gender: 'Female',
    reason: 'Diabetes Type-2 Routine Refill & Fasting Sugar Check',
    bp: '130/85',
    temp: '99.1°F',
    time: '11:30 AM',
    status: 'Consultation In Progress',
    vitals: { bp: '130/85', temp: '99.1°F', hr: '82 bpm', spo2: '98%' },
  },
  {
    id: 'p-104',
    name: 'Aarav Mehta',
    mrn: 'MRN-IN-1003',
    age: 11,
    gender: 'Male',
    reason: 'Pediatric General Checkup & Seasonal Asthma Review',
    bp: '110/70',
    temp: '98.4°F',
    time: '12:00 PM',
    status: 'Completed Today',
    vitals: { bp: '110/70', temp: '98.4°F', hr: '88 bpm', spo2: '100%' },
  },
];

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const { data: dbAppointments = [] } = useAppointments();
  const { data: dbPatients = [] } = usePatients();

  const [queue, setQueue] = useState<DoctorPatientQueueItem[]>(INITIAL_CLINICAL_QUEUE);
  const [activeTab, setActiveTab] = useState<'All' | 'Waiting' | 'Completed'>('All');
  const [selectedConsultation, setSelectedConsultation] = useState<DoctorPatientQueueItem | null>(null);

  // SOAP Consultation Form
  const [subjectiveNotes, setSubjectiveNotes] = useState('');
  const [objectiveNotes, setObjectiveNotes] = useState('');
  const [assessmentDiagnosis, setAssessmentDiagnosis] = useState('');
  const [medicationName, setMedicationName] = useState('Paracetamol 650mg');
  const [dosage, setDosage] = useState('1-0-1 (After Meals)');
  const [duration, setDuration] = useState('5 Days');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [prescriptionsList, setPrescriptionsList] = useState<
    { med: string; dose: string; dur: string }[]
  >([
    { med: 'Paracetamol 650mg', dose: '1-0-1', dur: '5 Days' },
    { med: 'Pantoprazole 40mg', dose: '1-0-0 (Before Breakfast)', dur: '7 Days' },
  ]);

  // Lab Signoff List
  const [labReports, setLabReports] = useState([
    { id: 'lab-1', patient: 'Rahul Verma', test: 'Complete Blood Count (CBC)', status: 'Pending Review', value: 'Hb: 14.2 g/dL, WBC: 7,800/mcL' },
    { id: 'lab-2', patient: 'Sunita Gupta', test: 'HbA1c & Fasting Glucose', status: 'Pending Review', value: 'HbA1c: 6.8% (Good Control)' },
    { id: 'lab-3', patient: 'Priya Patel', test: 'Dengue NS1 Antigen & CRP', status: 'Pending Review', value: 'CRP: Elevated (24 mg/L)' },
  ]);

  const handleStartConsultation = (patient: DoctorPatientQueueItem) => {
    setSelectedConsultation(patient);
    setSubjectiveNotes(`Patient ${patient.name} complains of ${patient.reason}.`);
    setObjectiveNotes(`BP: ${patient.vitals.bp}, Temp: ${patient.vitals.temp}, HR: ${patient.vitals.hr}, SpO2: ${patient.vitals.spo2}.`);
    setAssessmentDiagnosis('Acute Upper Respiratory Tract Infection (J06.9)');
  };

  const handleAiAutoScribe = () => {
    if (!selectedConsultation) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      setSubjectiveNotes(
        `Patient ${selectedConsultation.name} presents with ${selectedConsultation.reason} lasting 3 days. Denies shortness of breath or chest pain.`
      );
      setObjectiveNotes(
        `Vitals: BP ${selectedConsultation.vitals.bp} mmHg, Temp ${selectedConsultation.vitals.temp}, Pulse ${selectedConsultation.vitals.hr}, SpO2 ${selectedConsultation.vitals.spo2} on room air. Chest clear bilaterally on auscultation.`
      );
      setAssessmentDiagnosis('Essential Hypertension (I10) / Acute Rhinitis');
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleAddMedication = () => {
    if (!medicationName) return;
    setPrescriptionsList([
      ...prescriptionsList,
      { med: medicationName, dose: dosage, dur: duration },
    ]);
  };

  const handleCompleteConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsultation) return;

    setQueue((prev) =>
      prev.map((q) => (q.id === selectedConsultation.id ? { ...q, status: 'Completed Today' } : q))
    );
    setSelectedConsultation(null);
  };

  const handleSignoffLab = (id: string) => {
    setLabReports((prev) => prev.map((l) => (l.id === id ? { ...l, status: 'Signed Off' } : l)));
  };

  const filteredQueue = queue.filter((item) => {
    if (activeTab === 'Waiting') return item.status === 'In Waiting Room';
    if (activeTab === 'Completed') return item.status === 'Completed Today';
    return true;
  });

  const doctorName = user?.firstName ? `Dr. ${user.firstName} ${user.lastName}` : 'Dr. Siddharth Sharma';

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans flex items-center gap-2.5">
            <Stethoscope className="w-6 h-6 text-primary" />
            <span>Doctor Clinical Command Center</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold text-foreground">{doctorName}</span> — {tenant?.name || 'Apollo Hospitals, New Delhi'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/encounters/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Gemini AI SOAP Scribe</span>
          </Link>
        </div>
      </div>

      {/* Doctor Performance & Queue Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Today's Consultation Schedule</span>
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{queue.length} Scheduled</div>
          <div className="text-[11px] text-emerald-500 font-medium">100% Doctor Scoped</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Waiting Room Queue</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500">
            {queue.filter((q) => q.status === 'In Waiting Room').length} Patients Waiting
          </div>
          <div className="text-[11px] text-muted-foreground">Avg Consultation: 12 mins</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Completed Consultations</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-500">
            {queue.filter((q) => q.status === 'Completed Today').length} Completed
          </div>
          <div className="text-[11px] text-emerald-500 font-medium">E-Prescriptions Issued</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Pending Lab Sign-offs</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
              <TestTube className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-500">
            {labReports.filter((l) => l.status === 'Pending Review').length} Lab Reports
          </div>
          <div className="text-[11px] text-purple-400 font-medium">Awaiting doctor verification</div>
        </div>
      </div>

      {/* Main Workspace Layout: Active Queue & Pending Lab Signoffs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waiting Room Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  <span>Clinical Patient OPD Queue</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a patient to launch consultation, write SOAP notes, and generate e-prescriptions
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
                {(['All', 'Waiting', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      activeTab === tab
                        ? 'bg-card text-foreground shadow-xs border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Cards */}
            <div className="space-y-3">
              {filteredQueue.map((patient) => (
                <div
                  key={patient.id}
                  className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center border border-primary/20">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                          {patient.name}
                          <span className="font-mono text-[11px] text-muted-foreground font-normal">
                            ({patient.mrn})
                          </span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {patient.gender}, {patient.age} yrs • Scheduled {patient.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          patient.status === 'Completed Today'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : patient.status === 'Consultation In Progress'
                            ? 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        }`}
                      >
                        {patient.status}
                      </span>

                      {patient.status !== 'Completed Today' ? (
                        <button
                          onClick={() => handleStartConsultation(patient)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>Start Consultation</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartConsultation(patient)}
                          className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
                        >
                          View SOAP & Rx
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Vitals Telemetry bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-muted/20 p-2.5 rounded-lg border border-border/40">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Blood Pressure</span>
                      <span className="font-bold text-foreground font-mono">{patient.vitals.bp} mmHg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Temperature</span>
                      <span className="font-bold text-foreground font-mono">{patient.vitals.temp}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Heart Rate</span>
                      <span className="font-bold text-foreground font-mono">{patient.vitals.hr}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Oxygen Sat (SpO2)</span>
                      <span className="font-bold text-foreground font-mono">{patient.vitals.spo2}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Chief Complaint:</span> {patient.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Lab Reports Sign-off */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <TestTube className="w-4 h-4 text-purple-500" />
                <span>Pending Lab Sign-offs</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Review and sign off diagnostic lab results</p>
            </div>

            <div className="space-y-3">
              {labReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-lg border border-border bg-muted/20 p-3 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{report.patient}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        report.status === 'Signed Off'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium">{report.test}</p>
                  <p className="font-mono text-[11px] bg-card p-2 rounded border border-border/40 text-foreground">
                    {report.value}
                  </p>
                  {report.status !== 'Signed Off' && (
                    <button
                      onClick={() => handleSignoffLab(report.id)}
                      className="w-full mt-1 py-1.5 rounded bg-purple-600 text-white text-[11px] font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Sign Off Lab Report
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Bot className="w-4 h-4" />
              <span>Gemini Clinical Assistant</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Auto-generate ICD-10 codes, cross-check drug interactions, and transcribe voice consultations into structured SOAP notes.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Consultation & E-Prescription Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <span>Clinical Consultation & E-Prescription</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Patient: <span className="font-semibold text-foreground">{selectedConsultation.name}</span> ({selectedConsultation.mrn})
                </p>
              </div>

              <button
                onClick={() => setSelectedConsultation(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteConsultation} className="space-y-4">
              {/* Gemini AI Auto-Scribe Button */}
              <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Gemini AI Clinical Scribe</span>
                </div>
                <button
                  type="button"
                  onClick={handleAiAutoScribe}
                  disabled={isAiGenerating}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{isAiGenerating ? 'Generating SOAP...' : 'Auto-Fill SOAP Notes'}</span>
                </button>
              </div>

              {/* SOAP Section */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Subjective (Symptoms & Complaint)</label>
                  <textarea
                    rows={2}
                    value={subjectiveNotes}
                    onChange={(e) => setSubjectiveNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Objective (Vitals & Physical Exam)</label>
                  <textarea
                    rows={2}
                    value={objectiveNotes}
                    onChange={(e) => setObjectiveNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Assessment & Diagnosis (ICD-10 Code)</label>
                  <input
                    type="text"
                    value={assessmentDiagnosis}
                    onChange={(e) => setAssessmentDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              {/* E-Prescription Generator */}
              <div className="space-y-3 border-t border-border pt-3">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-emerald-500" />
                  <span>E-Prescription & Medicine Dispensing</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Paracetamol 650mg)"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-border bg-muted/30 text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1-0-1)"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-border bg-muted/30 text-foreground"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Duration (e.g. 5 Days)"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-border bg-muted/30 text-foreground flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="px-2 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Prescribed List */}
                <div className="space-y-1.5">
                  {prescriptionsList.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50 text-xs"
                    >
                      <span className="font-bold text-foreground">{p.med}</span>
                      <span className="font-mono text-muted-foreground">{p.dose} • {p.dur}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedConsultation(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                >
                  Complete Consultation & Sign Rx
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
