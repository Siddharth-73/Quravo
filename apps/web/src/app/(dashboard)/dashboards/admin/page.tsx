"use client";

import React from 'react';
import { Building2, DollarSign, Users, ShieldCheck, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ClinicOwnerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Owner Executive Workspace</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Apex Health Clinic — Revenue analytics, staff performance, and multi-branch operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/staff"
            className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 shadow-sm"
          >
            Manage Staff & Roles
          </Link>
          <Link
            href="/settings"
            className="px-3.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-medium hover:bg-muted"
          >
            Clinic Settings
          </Link>
        </div>
      </div>

      {/* Executive Revenue & Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">$42,850.00</div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Patients Served</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">348 Patients</div>
          <div className="text-[11px] text-muted-foreground">Across 3 branches</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Staff & Doctors</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">14 Practitioners</div>
          <div className="text-[11px] text-emerald-500">100% RBAC Scoped</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Branch Operations</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">3 Branches</div>
          <div className="text-[11px] text-muted-foreground">Main, Westside, North</div>
        </div>
      </div>
    </div>
  );
}
