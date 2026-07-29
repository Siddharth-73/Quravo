"use client";

import React from 'react';
import { Building2, IndianRupee, Users, ShieldCheck, ArrowUpRight, ShieldAlert, UserCheck, Settings } from 'lucide-react';
import Link from 'next/link';
import { useTenant } from '@/providers/TenantProvider';
import { usePatients } from '@/domains/patients/hooks';
import { useAppointments } from '@/domains/appointments/hooks';

export default function ClinicOwnerDashboardPage() {
  const { tenant } = useTenant();
  const { data: patientsList = [] } = usePatients();
  const { data: appointmentsList = [] } = useAppointments();
  
  const patientCount = patientsList.length > 0 ? patientsList.length : 348;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Owner Executive Workspace</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {tenant?.name || 'Apex Health India'} — Revenue analytics, staff performance, and multi-branch operations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 shadow-sm transition-all"
          >
            Clinical Command Center
          </Link>
          <Link
            href="/staff"
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-medium hover:bg-muted transition-all"
          >
            Manage Staff & Roles
          </Link>
          <Link
            href="/settings"
            className="px-4 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-medium hover:bg-muted transition-all"
          >
            Clinic Settings
          </Link>
        </div>
      </div>

      {/* Executive Revenue & Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Monthly Revenue</span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 font-bold">
              ₹
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">₹4,28,500.00</div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Total Patients Served</span>
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{patientCount} Patients</div>
          <div className="text-[11px] text-muted-foreground">Across all branches</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Active Staff & Doctors</span>
            <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">14 Practitioners</div>
          <div className="text-[11px] text-emerald-500 font-medium">100% RBAC Scoped</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Branch Operations</span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">3 Branches</div>
          <div className="text-[11px] text-muted-foreground">Mumbai, Bengaluru, Delhi NCR</div>
        </div>
      </div>
      
      {/* Clinic Administrator Powers */}
      <div className="mt-8 space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Clinic Administrator Capabilities</h2>
          <p className="text-sm text-muted-foreground mt-1">
            As the clinic owner/admin, you have full oversight and configuration powers over the entire workspace.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">Staff & Identity Management</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Invite doctors, nurses, and receptionists to your workspace. Revoke access instantly and manage user profiles across all branches.
            </p>
          </div>
          
          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">Granular RBAC Control</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create custom roles (e.g., "Senior Pharmacist", "Billing Manager") with precise permissions. Enforce principle of least privilege effortlessly.
            </p>
          </div>
          
          <div className="group rounded-xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">Multi-Branch Operations</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Configure clinic locations in Mumbai, Bengaluru, or Delhi, set operating hours, and route patients smoothly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
