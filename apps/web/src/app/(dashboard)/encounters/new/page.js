"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewEncounterPage;
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const lucide_react_1 = require("lucide-react");
const link_1 = __importDefault(require("next/link"));
const hooks_1 = require("@/domains/emr/hooks");
const hooks_2 = require("@/domains/patients/hooks");
function NewEncounterForm() {
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const patientId = searchParams.get('patientId') || 'p-101';
    const { data: patientsList = [] } = (0, hooks_2.usePatients)();
    const patient = patientsList.find(p => p.id === patientId);
    const patientNameFallback = patient ? `${patient.fullName} (${patient.mrn})` : 'Unknown Patient';
    const [patientName, setPatientName] = (0, react_1.useState)(patientNameFallback);
    const [subjective, setSubjective] = (0, react_1.useState)('');
    const [objective, setObjective] = (0, react_1.useState)('');
    const [assessment, setAssessment] = (0, react_1.useState)('');
    const [plan, setPlan] = (0, react_1.useState)('');
    const [prescriptions, setPrescriptions] = (0, react_1.useState)([]);
    const createEncounterMutation = (0, hooks_1.useCreateEncounter)();
    const createPrescriptionMutation = (0, hooks_1.useCreatePrescription)();
    const aiNotesMutation = (0, hooks_1.useAiNotes)();
    const [aiJobId, setAiJobId] = (0, react_1.useState)(null);
    const { data: aiResult } = (0, hooks_1.useAiResult)(aiJobId);
    const isAiProcessing = aiNotesMutation.isPending || (aiJobId !== null && aiResult?.status !== 'completed' && aiResult?.status !== 'failed');
    const addPrescription = () => {
        setPrescriptions((prev) => [
            ...prev,
            { id: String(Date.now()), name: '', dosage: '', quantity: '10' },
        ]);
    };
    const removePrescription = (id) => {
        setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    };
    const handleAiAssist = async () => {
        try {
            const result = await aiNotesMutation.mutateAsync({
                appointmentId: patientId,
                rawNotes: subjective || 'Patient has a sore throat.',
            });
            setAiJobId(result.jobId);
        }
        catch (e) {
            console.error(e);
        }
    };
    react_1.default.useEffect(() => {
        if (aiResult?.status === 'completed' && aiResult.result) {
            setSubjective(aiResult.result);
        }
    }, [aiResult]);
    const handleSave = async (e) => {
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
        }
        catch (e) {
            console.error(e);
        }
    };
    const isSaving = createEncounterMutation.isPending || createPrescriptionMutation.isPending;
    return (<div className="space-y-6 max-w-5xl">
      <div className="space-y-4">
        <link_1.default href="/patients" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
          <lucide_react_1.ArrowLeft className="w-3.5 h-3.5"/>
          <span>Back to Patients</span>
        </link_1.default>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">New Clinical SOAP Encounter</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Record clinical encounter notes, ICD-10 assessment, and electronic prescriptions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={handleAiAssist} disabled={isAiProcessing || isSaving} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors shadow-xs">
              {isAiProcessing ? <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/> : <lucide_react_1.Sparkles className="w-3.5 h-3.5 text-primary"/>}
              <span>{isAiProcessing ? 'Analyzing Note...' : 'Auto-Fill with AI Assist'}</span>
            </button>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
              {isSaving ? <lucide_react_1.Loader2 className="w-3.5 h-3.5 animate-spin"/> : <lucide_react_1.Save className="w-3.5 h-3.5"/>}
              <span>{isSaving ? 'Saving...' : 'Sign & Save Encounter'}</span>
            </button>
          </div>
        </div>

        {aiResult?.status === 'failed' && (<div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-500">
            AI Assist failed: {aiResult.error || 'Unknown error'}
          </div>)}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Patient Selection Card */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <lucide_react_1.User className="w-4 h-4 text-primary"/>
            <span className="font-semibold text-foreground">Patient:</span>
            <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="rounded border border-border bg-muted/30 px-3 py-1 font-medium text-foreground text-xs" disabled/>
          </div>
        </div>

        {/* SOAP 4-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">Subjective (S)</label>
            <textarea rows={5} placeholder="Enter patient complaints, history of present illness..." value={subjective} onChange={(e) => setSubjective(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" disabled={isSaving}/>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-500">Objective (O)</label>
            <textarea rows={5} placeholder="Enter vital signs, physical exam observations..." value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20" disabled={isSaving}/>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-500">Assessment (A)</label>
            <textarea rows={5} placeholder="Enter clinical assessment & ICD-10 diagnosis..." value={assessment} onChange={(e) => setAssessment(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20" disabled={isSaving}/>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-500">Plan (P)</label>
            <textarea rows={5} placeholder="Enter treatment plan & patient advice..." value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-lg border border-border bg-muted/30 p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20" disabled={isSaving}/>
          </div>
        </div>

        {/* Electronic Prescription Builder */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-sm text-foreground">Electronic Prescription Builder</h3>
            <button type="button" onClick={addPrescription} disabled={isSaving} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-medium hover:bg-muted">
              <lucide_react_1.Plus className="w-3.5 h-3.5"/>
              <span>Add Medication Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {prescriptions.map((rx) => (<div key={rx.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                <input type="text" placeholder="Medication Name" value={rx.name} onChange={(e) => {
                const name = e.target.value;
                setPrescriptions((prev) => prev.map((p) => (p.id === rx.id ? { ...p, name } : p)));
            }} className="sm:col-span-5 rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground" disabled={isSaving}/>
                <input type="text" placeholder="Dosage / Directions" value={rx.dosage} onChange={(e) => {
                const dosage = e.target.value;
                setPrescriptions((prev) => prev.map((p) => (p.id === rx.id ? { ...p, dosage } : p)));
            }} className="sm:col-span-4 rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground" disabled={isSaving}/>
                <input type="text" placeholder="Qty" value={rx.quantity} onChange={(e) => {
                const quantity = e.target.value;
                setPrescriptions((prev) => prev.map((p) => (p.id === rx.id ? { ...p, quantity } : p)));
            }} className="sm:col-span-2 rounded-lg border border-border bg-muted/30 p-2.5 text-xs text-foreground font-mono" disabled={isSaving}/>
                <button type="button" onClick={() => removePrescription(rx.id)} disabled={isSaving} className="sm:col-span-1 p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 flex justify-center">
                  <lucide_react_1.Trash2 className="w-4 h-4"/>
                </button>
              </div>))}
            {prescriptions.length === 0 && (<div className="text-muted-foreground py-2 text-center">No prescriptions added.</div>)}
          </div>
        </div>
      </form>
    </div>);
}
function NewEncounterPage() {
    return (<react_1.Suspense fallback={<div className="p-6 text-xs text-muted-foreground flex justify-center"><lucide_react_1.Loader2 className="animate-spin w-6 h-6"/></div>}>
      <NewEncounterForm />
    </react_1.Suspense>);
}
