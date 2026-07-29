"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DoctorDashboardPage;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const hooks_1 = require("@/domains/dashboard/hooks");
function DoctorDashboardPage() {
    const appointments = (0, hooks_1.useTodayAppointments)();
    const queue = (0, hooks_1.useLiveQueue)();
    const completed = appointments.data?.filter((appointment) => appointment.status === 'completed').length ?? 0;
    return <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight text-foreground">Doctor Clinical Command Center</h1><p className="text-xs text-muted-foreground mt-0.5">Your live clinical schedule and waiting queue for today.</p></div><link_1.default href="/encounters/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium"><lucide_react_1.Sparkles className="w-3.5 h-3.5"/>New SOAP Encounter</link_1.default></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="rounded-xl border border-border bg-card p-5"><span className="text-xs text-muted-foreground">Today&apos;s appointments</span><div className="text-2xl font-bold text-foreground">{appointments.isLoading ? 'Loading…' : appointments.isError ? 'Unavailable' : appointments.data?.length ?? 0}</div><span className="text-[11px] text-muted-foreground">{appointments.isError ? 'Appointment access could not be loaded.' : `${completed} completed`}</span></div><div className="rounded-xl border border-border bg-card p-5"><span className="text-xs text-muted-foreground">Waiting room queue</span><div className="text-2xl font-bold text-amber-500">{queue.isLoading ? 'Loading…' : queue.isError ? 'Unavailable' : queue.isUnavailable ? 'No branch' : queue.data?.length ?? 0}</div><span className="text-[11px] text-muted-foreground">Live queue for the configured branch</span></div></div>
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4"><h3 className="font-semibold text-sm text-foreground border-b border-border pb-2">Waiting Room Clinical Queue</h3>{queue.isError ? <p className="text-xs text-destructive">Unable to load the live queue.</p> : queue.isUnavailable ? <p className="text-xs text-muted-foreground">No branch is configured for a live queue.</p> : queue.isLoading ? <p className="text-xs text-muted-foreground">Loading queue…</p> : queue.data?.length === 0 ? <p className="text-xs text-muted-foreground">No patients are currently in the waiting room.</p> : <div className="space-y-3">{queue.data?.map((appointment) => <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border bg-muted/20 text-xs"><div><div className="font-bold text-foreground">{appointment.patientLabel}</div><div className="text-muted-foreground mt-0.5">{appointment.reason || 'No visit reason provided'} · {(0, hooks_1.formatAppointmentTime)(appointment.startTime)}</div></div>{appointment.patientId ? <link_1.default href={`/encounters/new?patientId=${appointment.patientId}`} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Start SOAP Note <lucide_react_1.ArrowRight className="w-3.5 h-3.5"/></link_1.default> : <span className="text-muted-foreground">Patient record unavailable</span>}</div>)}</div>}</div>
  </div>;
}
