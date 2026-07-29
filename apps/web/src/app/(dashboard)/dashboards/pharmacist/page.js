"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PharmacistDashboardPage;
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
function PharmacistDashboardPage() {
    return <div className="space-y-6"><div><h1 className="text-2xl font-bold tracking-tight text-foreground">Pharmacy Workspace</h1><p className="text-xs text-muted-foreground mt-0.5">Pharmacy dispensing and inventory are not enabled for this tenant.</p></div><div className="rounded-xl border border-border bg-card p-8 text-center"><lucide_react_1.Pill className="mx-auto h-8 w-8 text-muted-foreground"/><h2 className="mt-4 text-base font-semibold text-foreground">Pharmacy dispensing is not available</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">This ERP module has not been implemented yet. No prescription queue, stock count, or dispensing status is shown.</p><link_1.default href="/patients" className="inline-flex mt-5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Open Patient Records</link_1.default></div></div>;
}
