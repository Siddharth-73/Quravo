"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ClinicOwnerDashboardPage;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
const TenantProvider_1 = require("@/providers/TenantProvider");
const hooks_1 = require("@/domains/billing/hooks");
const hooks_2 = require("@/domains/clinic/hooks");
const hooks_3 = require("@/domains/dashboard/hooks");
function MetricCard({ label, value, detail, icon: Icon }) {
    return <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm">
    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground"><span>{label}</span><Icon className="w-4 h-4 text-primary"/></div>
    <div className="text-2xl font-bold text-foreground">{value}</div><div className="text-[11px] text-muted-foreground">{detail}</div>
  </div>;
}
function ClinicOwnerDashboardPage() {
    const { tenant } = (0, TenantProvider_1.useTenant)();
    const patients = (0, hooks_3.useLivePatients)();
    const staff = (0, hooks_2.useStaff)();
    const branches = (0, hooks_2.useBranches)();
    const invoices = (0, hooks_1.useInvoices)();
    const outstanding = invoices.data?.reduce((sum, invoice) => sum + (Number.parseFloat(invoice.amountDue) || 0), 0);
    const hasError = patients.isError || staff.isError || branches.isError || invoices.isError;
    return <div className="space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Owner Executive Workspace</h1><p className="text-xs text-muted-foreground mt-1">{tenant?.name || 'Your Clinic'} — live clinic operations overview</p></div><div className="flex flex-wrap gap-2"><link_1.default href="/staff" className="px-4 py-2 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted">Manage Staff & Roles</link_1.default><link_1.default href="/settings" className="px-4 py-2 rounded-lg border border-border bg-card text-xs font-medium hover:bg-muted">Clinic Settings</link_1.default></div></div>
    {hasError && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">Some live clinic data could not be loaded. Visit the linked modules to manage available records.</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      label="Outstanding invoice balance" value={invoices.isLoading ? 'Loading…' : outstanding === undefined ? 'Unavailable' : outstanding.toLocaleString(undefined, { style: 'currency', currency: 'USD' })} detail="Sum of current invoice amounts due"
      <MetricCard label="Patients" value={patients.isLoading ? 'Loading…' : patients.isError ? 'Unavailable' : String(patients.data?.length ?? 0)} detail="Patient records accessible to this tenant" icon={lucide_react_1.Users}/>
      <MetricCard label="Staff" value={staff.isLoading ? 'Loading…' : staff.isError ? 'Unavailable' : String(staff.data?.length ?? 0)} detail="Current staff records" icon={lucide_react_1.ShieldCheck}/>
      <MetricCard label="Branches" value={branches.isLoading ? 'Loading…' : branches.isError ? 'Unavailable' : String(branches.data?.length ?? 0)} detail="Configured clinic locations" icon={lucide_react_1.Building2}/>
    </div>
    <div className="rounded-xl border border-border bg-card p-6"><h2 className="text-lg font-semibold text-foreground">Manage your clinic</h2><p className="mt-1 text-sm text-muted-foreground">Use the live workspace modules to maintain staff, locations, patient records, appointments, and invoices.</p><div className="mt-4 flex flex-wrap gap-3"><link_1.default href="/patients" className="text-sm font-medium text-primary hover:underline">Patient records</link_1.default><link_1.default href="/appointments" className="text-sm font-medium text-primary hover:underline">Appointments</link_1.default><link_1.default href="/billing" className="text-sm font-medium text-primary hover:underline">Invoices</link_1.default></div></div>
  </div>;
}
