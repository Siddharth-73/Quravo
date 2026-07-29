"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReceptionistDashboardPage;
const link_1 = __importDefault(require("next/link"));
const hooks_1 = require("@/domains/billing/hooks");
const hooks_2 = require("@/domains/dashboard/hooks");
function ReceptionistDashboardPage() {
    const appointments = (0, hooks_2.useTodayAppointments)();
    const patients = (0, hooks_2.useLivePatients)();
    const invoices = (0, hooks_1.useInvoices)();
    const checkedIn = appointments.data?.filter((appointment) => appointment.status === 'checked_in').length ?? 0;
    const amountDue = invoices.data?.reduce((sum, invoice) => sum + (Number.parseFloat(invoice.amountDue) || 0), 0);
    return <div className="space-y-6"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight text-foreground">Front Desk Receptionist Workspace</h1><p className="text-xs text-muted-foreground mt-0.5">Live appointments, patients, and invoice balances.</p></div><div className="flex gap-2"><link_1.default href="/appointments" className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Book Appointment</link_1.default><link_1.default href="/billing" className="px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted">Open Billing</link_1.default></div></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><Card label="Checked-in appointments" value={appointments.isLoading ? 'Loading…' : appointments.isError ? 'Unavailable' : String(checkedIn)} detail="From today’s live appointment list"/><Card label="Patients" value={patients.isLoading ? 'Loading…' : patients.isError ? 'Unavailable' : String(patients.data?.length ?? 0)} detail="Accessible patient records"/><Card label="Outstanding invoice balance" value={invoices.isLoading ? 'Loading…' : invoices.isError ? 'Unavailable' : amountDue?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) ?? '$0.00'} detail="Sum of current invoice amounts due"/></div><div className="rounded-xl border border-border bg-card p-5"><h2 className="font-semibold text-sm text-foreground">Front desk actions</h2><p className="mt-1 text-xs text-muted-foreground">Use the appointments, patients, and billing modules to manage live records.</p><div className="mt-3 flex gap-4 text-xs font-medium text-primary"><link_1.default href="/patients">Patient directory</link_1.default><link_1.default href="/appointments">Appointments</link_1.default><link_1.default href="/billing">Invoices</link_1.default></div></div></div>;
}
function Card({ label, value, detail }) { return <div className="rounded-xl border border-border bg-card p-5 space-y-1 shadow-xs"><span className="text-xs text-muted-foreground">{label}</span><div className="text-2xl font-bold text-foreground">{value}</div><span className="text-[11px] text-muted-foreground">{detail}</span></div>; }
