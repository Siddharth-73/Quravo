"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NurseDashboardPage;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/dashboard/hooks");
function NurseDashboardPage() {
    const patients = (0, hooks_1.useLivePatients)();
    const appointments = (0, hooks_1.useTodayAppointments)();
    const queue = (0, hooks_1.useLiveQueue)();
    return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight text-foreground">Nurse Triage & Patient Vitals Station</h1><p className="text-xs text-muted-foreground mt-0.5">Live patient, appointment, and queue information for clinical intake.</p></div><link_1.default href="/patients" className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium"><lucide_react_1.Activity className="w-3.5 h-3.5"/>Open Patient Records</link_1.default></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Metric label="Live triage queue" query={queue} value={queue.isUnavailable ? 'No branch' : queue.data?.length}/><Metric label="Today&apos;s appointments" query={appointments} value={appointments.data?.length}/><Metric label="Accessible patients" query={patients} value={patients.data?.length}/></div><div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4"><h3 className="font-semibold text-sm text-foreground border-b border-border pb-2">Live Patient Triage Queue</h3>{queue.isError ? <p className="text-xs text-destructive">Unable to load the live queue.</p> : queue.isUnavailable ? <p className="text-xs text-muted-foreground">Configure a branch to view its queue.</p> : queue.isLoading ? <p className="text-xs text-muted-foreground">Loading queue…</p> : queue.data?.length === 0 ? <p className="text-xs text-muted-foreground">No patients are currently queued for triage.</p> : <div className="space-y-3">{queue.data?.map((appointment) => <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 text-xs"><div><div className="font-bold text-foreground">{appointment.patientLabel}</div><div className="text-muted-foreground mt-0.5">{appointment.reason || 'No visit reason provided'} · {(0, hooks_1.formatAppointmentTime)(appointment.startTime)}</div></div>{appointment.patientId && <link_1.default href={`/patients/${appointment.patientId}`} className="text-primary font-medium hover:underline">Open record</link_1.default>}</div>)}</div>}</div></div>;
}
function Metric({ label, query, value }) { return <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs"><span className="text-xs text-muted-foreground">{label}</span><div className="text-2xl font-bold text-foreground">{query.isLoading ? 'Loading…' : query.isError ? 'Unavailable' : value ?? 0}</div></div>; }
