"use client";

import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Thermometer,
  UserCheck,
  Bed,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
  Stethoscope,
  X,
  Sparkles,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { usePatients } from '@/domains/patients/hooks';
import { useTenant } from '@/providers/TenantProvider';

interface PatientVitalRecord {
  id: string;
  name: string;
  mrn: string;
  gender: string;
  age: number;
  bp: string;
  temp: string;
  hr: string;
  spo2: string;
  priority: 'Urgent' | 'Moderate' | 'Routine';
  status: 'Triage Complete' | 'Awaiting Vitals' | 'In Consultation';
  triageNotes: string;
  recordedAt: string;
}

const INITIAL_VITALS: PatientVitalRecord[] = [
  {
    id: 'v-101',
    name: 'Rahul Verma',
    mrn: 'MRN-IN-1001',
    gender: 'Male',
    age: 38,
    bp: '124/82',
    temp: '98.6°F',
    hr: '76 bpm',
    spo2: '99%',
    priority: 'Routine',
    status: 'Triage Complete',
    triageNotes: 'Routine OPD checkup. Complaining of mild throat irritation.',
    recordedAt: '10 mins ago',
  },
  {
    id: 'v-102',
    name: 'Priya Patel',
    mrn: 'MRN-IN-1002',
    gender: 'Female',
    age: 34,
    bp: '142/94',
    temp: '101.4°F',
    hr: '92 bpm',
    spo2: '97%',
    priority: 'Urgent',
    status: 'Awaiting Vitals',
    triageNotes: 'High fever since 2 days, joint body pain.',
    recordedAt: '25 mins ago',
  },
  {
    id: 'v-103',
    name: 'Sunita Gupta',
    mrn: 'MRN-IN-1004',
    gender: 'Female',
    age: 51,
    bp: '130/85',
    temp: '99.1°F',
    hr: '82 bpm',
    spo2: '98%',
    priority: 'Moderate',
    status: 'Triage Complete',
    triageNotes: 'Hypertension follow-up visit. Vitals stable.',
    recordedAt: '40 mins ago',
  },
  {
    id: 'v-104',
    name: 'Aarav Mehta',
    mrn: 'MRN-IN-1003',
    gender: 'Male',
    age: 11,
    bp: '110/70',
    temp: '98.4°F',
    hr: '88 bpm',
    spo2: '100%',
    priority: 'Routine',
    status: 'Awaiting Vitals',
    triageNotes: 'Pediatric general physical examination.',
    recordedAt: '1 hour ago',
  },
];

export default function NurseDashboardPage() {
  const { tenant } = useTenant();
  const { data: dbPatients = [] } = usePatients();

  const [vitalsList, setVitalsList] = useState<PatientVitalRecord[]>(INITIAL_VITALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<PatientVitalRecord | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formMrn, setFormMrn] = useState('');
  const [formBp, setFormBp] = useState('120/80');
  const [formTemp, setFormTemp] = useState('98.6°F');
  const [formHr, setFormHr] = useState('78 bpm');
  const [formSpo2, setFormSpo2] = useState('99%');
  const [formPriority, setFormPriority] = useState<'Urgent' | 'Moderate' | 'Routine'>('Routine');
  const [formNotes, setFormNotes] = useState('');

  // Nurse Checklist
  const [nurseTasks, setNurseTasks] = useState([
    { id: 't-1', task: 'Administer IV Dextrose (500ml) to Bed 4 - Priya Patel', completed: false, time: '14:30' },
    { id: 't-2', task: 'Collect Stat Blood Sample (CBC/CRP) for Rahul Verma', completed: true, time: '13:15' },
    { id: 't-3', task: 'Verify Emergency Crash Cart Seals in Triage Bay B', completed: false, time: '15:00' },
    { id: 't-4', task: 'Nebulization Treatment for Inpatient Ward Bed 12', completed: false, time: '16:00' },
  ]);

  const handleRecordVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const newRecord: PatientVitalRecord = {
      id: `v-${Date.now()}`,
      name: formName,
      mrn: formMrn || `MRN-IN-${Math.floor(1000 + Math.random() * 9000)}`,
      gender: 'Other',
      age: 30,
      bp: formBp,
      temp: formTemp,
      hr: formHr,
      spo2: formSpo2,
      priority: formPriority,
      status: 'Triage Complete',
      triageNotes: formNotes || 'Initial triage intake completed by staff nurse.',
      recordedAt: 'Just now',
    };

    setVitalsList([newRecord, ...vitalsList]);
    setIsNewModalOpen(false);

    // Reset Form
    setFormName('');
    setFormMrn('');
    setFormNotes('');
  };

  const handleUpdatePatientVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientForEdit) return;

    setVitalsList((prev) =>
      prev.map((v) =>
        v.id === selectedPatientForEdit.id
          ? {
              ...v,
              bp: formBp,
              temp: formTemp,
              hr: formHr,
              spo2: formSpo2,
              priority: formPriority,
              status: 'Triage Complete',
              triageNotes: formNotes || v.triageNotes,
              recordedAt: 'Updated just now',
            }
          : v
      )
    );
    setSelectedPatientForEdit(null);
  };

  const toggleTask = (id: string) => {
    setNurseTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filteredVitals = vitalsList.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.mrn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || v.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const urgentCount = vitalsList.filter((v) => v.priority === 'Urgent').length;
  const pendingCount = vitalsList.filter((v) => v.status === 'Awaiting Vitals').length;

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Nurse Triage & Patient Vitals Station
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {tenant?.name || 'Apollo Hospitals, New Delhi'} — Clinical triage intake, vital signs telemetry, and ward task management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Vitals Intake</span>
          </button>
        </div>
      </div>

      {/* Triage & Ward Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Patients in Triage Queue</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{vitalsList.length} Patients</div>
          <div className="text-[11px] text-amber-500 font-medium">{pendingCount} awaiting initial vitals</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Urgent Triage Alerts</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-500">{urgentCount} High Priority</div>
          <div className="text-[11px] text-rose-400">Immediate physician review required</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Inpatient Bed Occupancy</span>
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">18 / 24 Beds</div>
          <div className="text-[11px] text-emerald-500 font-medium">75% Occupancy — 6 Beds Available</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>Stat Nurse Checklist</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {nurseTasks.filter((t) => t.completed).length} / {nurseTasks.length} Completed
          </div>
          <div className="text-[11px] text-muted-foreground">Shift medication tasks</div>
        </div>
      </div>

      {/* Main Content Grid: Triage List & Shift Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Triage Queue & Vitals List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-500" />
                  <span>Active Patient Triage & Vital Signs Queue</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspect recorded blood pressure, pulse, temperature, SpO2, and triage status
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search patient..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-primary text-foreground w-36 sm:w-44"
                  />
                </div>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-border bg-muted/30 text-foreground focus:outline-none"
                >
                  <option value="All">All Priority</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Routine">Routine</option>
                </select>
              </div>
            </div>

            {/* Vitals Cards List */}
            <div className="space-y-3">
              {filteredVitals.map((v) => (
                <div
                  key={v.id}
                  className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-all shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center border border-emerald-500/20">
                        {v.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                          {v.name}
                          <span className="font-mono text-[11px] text-muted-foreground font-normal">({v.mrn})</span>
                        </h3>
                        <span className="text-[11px] text-muted-foreground">{v.gender}, {v.age} yrs • Recorded {v.recordedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          v.priority === 'Urgent'
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                            : v.priority === 'Moderate'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        }`}
                      >
                        {v.priority} Priority
                      </span>

                      <button
                        onClick={() => {
                          setSelectedPatientForEdit(v);
                          setFormBp(v.bp);
                          setFormTemp(v.temp);
                          setFormHr(v.hr);
                          setFormSpo2(v.spo2);
                          setFormPriority(v.priority);
                          setFormNotes(v.triageNotes);
                        }}
                        className="px-3 py-1 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        Update Vitals
                      </button>
                    </div>
                  </div>

                  {/* Vitals Data Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40">
                      <span className="text-[10px] text-muted-foreground font-medium block">Blood Pressure</span>
                      <span className="font-bold text-foreground font-mono">{v.bp} mmHg</span>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40">
                      <span className="text-[10px] text-muted-foreground font-medium block">Temperature</span>
                      <span className="font-bold text-foreground font-mono">{v.temp}</span>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40">
                      <span className="text-[10px] text-muted-foreground font-medium block">Heart Rate</span>
                      <span className="font-bold text-foreground font-mono">{v.hr}</span>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2.5 border border-border/40">
                      <span className="text-[10px] text-muted-foreground font-medium block">Oxygen Sat (SpO2)</span>
                      <span className="font-bold text-foreground font-mono">{v.spo2}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-lg border border-border/30">
                    <span className="font-semibold text-foreground">Triage Complaint:</span> {v.triageNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Shift Medication & Duty Checklist */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Stat Nurse Shift Checklist</span>
                </h3>
                <p className="text-[11px] text-muted-foreground">Click task to toggle completion status</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {nurseTasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left text-xs transition-all ${
                    t.completed
                      ? 'bg-muted/30 border-border/40 text-muted-foreground line-through opacity-70'
                      : 'bg-card border-border text-foreground hover:border-emerald-500/40'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      t.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-border bg-muted/40'
                    }`}
                  >
                    {t.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{t.task}</p>
                    <span className="text-[10px] text-muted-foreground font-mono block mt-1">Due {t.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Ward Status Info */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Ward Operations Telemetry</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All triage vitals intake forms generate automatic medical telemetry for attending doctors and emergency response teams.
            </p>
          </div>
        </div>
      </div>

      {/* Record New Vitals Intake Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span>Record Patient Vitals Intake</span>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordVitals} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Patient MRN</label>
                  <input
                    type="text"
                    placeholder="e.g. MRN-IN-1005"
                    value={formMrn}
                    onChange={(e) => setFormMrn(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Blood Pressure</label>
                  <input
                    type="text"
                    value={formBp}
                    onChange={(e) => setFormBp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Temperature</label>
                  <input
                    type="text"
                    value={formTemp}
                    onChange={(e) => setFormTemp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Heart Rate</label>
                  <input
                    type="text"
                    value={formHr}
                    onChange={(e) => setFormHr(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">SpO2 Oxygen</label>
                  <input
                    type="text"
                    value={formSpo2}
                    onChange={(e) => setFormSpo2(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Triage Priority Level</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none text-foreground"
                >
                  <option value="Routine">Routine (Green)</option>
                  <option value="Moderate">Moderate (Yellow)</option>
                  <option value="Urgent">Urgent (Red Alert)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Chief Triage Notes & Symptoms</label>
                <textarea
                  rows={3}
                  placeholder="Record patient complaints, allergies, and observation notes..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                >
                  Save Vitals Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vitals Modal */}
      {selectedPatientForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-base">
                <Activity className="w-5 h-5 text-emerald-500" />
                <span>Update Vitals for {selectedPatientForEdit.name}</span>
              </div>
              <button
                onClick={() => setSelectedPatientForEdit(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePatientVitals} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Blood Pressure</label>
                  <input
                    type="text"
                    value={formBp}
                    onChange={(e) => setFormBp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Temperature</label>
                  <input
                    type="text"
                    value={formTemp}
                    onChange={(e) => setFormTemp(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Heart Rate</label>
                  <input
                    type="text"
                    value={formHr}
                    onChange={(e) => setFormHr(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">SpO2 Oxygen</label>
                  <input
                    type="text"
                    value={formSpo2}
                    onChange={(e) => setFormSpo2(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Triage Priority Level</label>
                <select
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none text-foreground"
                >
                  <option value="Routine">Routine (Green)</option>
                  <option value="Moderate">Moderate (Yellow)</option>
                  <option value="Urgent">Urgent (Red Alert)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">Updated Observation Notes</label>
                <textarea
                  rows={3}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setSelectedPatientForEdit(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                >
                  Update Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
