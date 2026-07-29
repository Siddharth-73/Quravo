"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PatientPortalDashboardPage;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function PatientPortalDashboardPage() {
    return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight text-foreground">My Health & Appointments Portal</h1><p className="text-xs text-muted-foreground mt-0.5">Book an appointment with your clinic.</p></div><link_1.default href="/book" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"><lucide_react_1.CalendarDays className="w-3.5 h-3.5"/>Book New Appointment</link_1.default></div><div className="rounded-xl border border-border bg-card p-8 text-center"><lucide_react_1.CalendarDays className="mx-auto h-8 w-8 text-muted-foreground"/><h2 className="mt-4 text-base font-semibold text-foreground">Patient self-service records are not enabled</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">This tenant does not currently provide authenticated access to appointments, records, prescriptions, or reports in the patient portal.</p><link_1.default href="/book" className="inline-flex mt-5 text-sm font-medium text-primary hover:underline">Go to public booking</link_1.default></div></div>;
}
