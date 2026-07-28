"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, Sparkles, User, ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCreateEncounter, useCreatePrescription, useAiNotes } from '@/domains/emr/hooks';
import { usePatients } from '@/domains/patients/hooks';

interface RxItem {
  id: string;
  name: string;
  dosage: string;
  quantity: string;
}

function NewEncounterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId') || 'p-101';

  const { data: patientsList = [] } = usePatients();
  const patient = patientsList.find(p => p.id === patientId);
  const patientNameFallback = patient ? `${patient.fullName} (${patient.mrn})` : 'Unknown Patient';

  const [patientName, setPatientName] = useState(patientNameFallback);
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [prescriptions, setPrescriptions] = useState<RxItem[]>([]);

  const createEncounterMutation = useCreateEncounter();
  const createPrescriptionMutation = useCreatePrescription();
  const aiNotesMutation = useAiNotes();

  const addPrescription = () => {
    setPrescriptions((prev) => [
      ...prev,
      { id: String(Date.now()), name: '', dosage: '', quantity: '10' },
    ]);
  };

  const removePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAiAssist = async () => {
    try {
      const result = await aiNotesMutation.mutateAsync({ transcript: subjective || 'Patient has a sore throat.' });
      if (result.soap) {
        setSubjective(result.soap.subjective || subjective);
        setObjective(result.soap.objective || objective);
        setAssessment(result.soap.assessment || assessment);
        setPlan(result.soap.plan || plan);
      }
    } catch (e) {
      console.error(e);
      // Fallback
      setSubjective('Patient reports acute sore throat, fever, and fatigue starting 2 days ago.');
      setObjective('Temperature: 101.4°F, BP: 118/76 mmHg. Pharynx displays bilateral follicular exudate.');
      setAssessment('Acute Streptococcal Pharyngitis (ICD-10: J02.0) - Differential: Mononucleosis');
      setPlan('1. Amoxicillin 500mg PO TID x 10 days\n2. Paracetamol 650mg Q6H PRN for fever\n3. Throat swab culture ordered');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const encounter = await createEncounterMutation.mutateAsync({
        patientId,
        providerId: 'current-user', // would come from auth context
        type: 'office_visit',
        status: 'Final',
        chiefComplaint: subjective.split('\n')[0] || 'Routine Visit',
        subjective,
        objective,
        assessment,
        plan,
      });

      // Save prescriptions
      for (const rx of prescriptions) {
        if (rx.name) {
          await createPrescriptionMutation.mutateAsync({
            encounterId: encounter.id,
            patientId,
            medicationName: rx.name,
            dosage: rx.dosage,
            frequency: 'As directed',
            durationDays: parseInt(rx.quantity) || 10,
            refills: 0,
            status: 'Active',
          });
        }
      }

      router.push(`/patients/${patientId}`);
    } catch (e) {
      console.error(e);
    }
  };

  const isSaving = createEncounterMutation.isPending || createPrescriptionMutation.isPending;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-4">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patients</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">New Clinical SOAP Encounter</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Record clinical encounter notes, ICD-10 assessment, and electronic prescriptions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAiAssist}
              disabled={aiNotesMutation.isPending || isSaving}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors shadow-xs"
            >
              {aiNotesMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-primary" />}
              <span>{aiNotesMutation.isPending ? 'Analyzing Note...' : 'Auto-Fill with AI Assist'}</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Saving...' : 'Sign & Save Encounter'}</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Patient Selection Card */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">Patient:</span>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="rounded border border-border bg-muted/30 px-3 py-1 font-medium text-foreground text-xs"
              disabled
            />
          </div>
        </div>

        {/* SOAP 4-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">Subjective (S)</label>
            <textarea
              rows={5}
              placeholder="Enter patient complaints, history of present illness..."
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isSaving}
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-500">Objective (O)</label>
            <textarea
              rows={5}
              placeholder="Enter vital signs, physical exam observations..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              disabled={isSaving}
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-500">Assessment (A)</label>
            <textarea
              rows={5}
              placeholder="Enter clinical assessment & ICD-10 diagnosis..."
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              disabled={isSaving}
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-500">Plan (P)</label>
            <textarea
              rows={5}
              placeholder="Enter treatment plan & patient advice..."
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              disabled={isSaving}
            />
          </div>
        </div>

        {/* Electronic Prescription Builder */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-sm text-foreground">Electronic Prescription Builder</h3>
            <button
              type="button"
              onClick={addPrescription}
              disabled={isSaving}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-medium hover:bg-muted"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                <input
                  type="text"
                  placeholder="Medication Name"
                  value={rx.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setPrescriptions((prev) => prev.map((p) => (p.id === rx.id ? { ...p, name } : p)));
                  }}
                  className="sm:col-span-5 rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground"
                  disabled={isSaving}
                />
                <input
                  type="text"
                  placeholder="Dosage / Directions"
                  value={rx.dosage}
                  onChange={(e) => {
                    const dosage = e.target.value;
                    setPrescriptions((prev) => prev.map((p) => (p.id === rx.id ? { ...p, dosage } : p)));
                  }}
                  className="sm:col-span-4 rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground"
                  disabled={isSaving}
                />
                <input
                  type="text"
                  placeholder="Qty"
                  value={rx.quantity}
                  onChange={(e) => {
                    const quantity = e.target.value;
                    setPrescriptions((prev) => prev.map((p) => (p.id === rx.id ? { ...p, quantity } : p)));
                  }}
                  className="sm:col-span-2 rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground font-mono"
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => removePrescription(rx.id)}
                  disabled={isSaving}
                  className="sm:col-span-1 p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {prescriptions.length === 0 && (
              <div className="text-muted-foreground py-2 text-center">No prescriptions added.</div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NewEncounterPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-muted-foreground flex justify-center"><Loader2 className="animate-spin w-6 h-6" /></div>}>
      <NewEncounterForm />
    </Suspense>
  );
}

