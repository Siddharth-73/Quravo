"use client";

import React from 'react';
import { UserCheck, ShieldCheck, Mail, Plus, UserPlus } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Lead Physician' | 'Receptionist' | 'Pharmacist' | 'Clinic Owner';
  branch: string;
  status: 'Active' | 'Invited';
}

const mockStaff: StaffMember[] = [
  { id: '1', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@apexhealth.com', role: 'Lead Physician', branch: 'Main Clinic', status: 'Active' },
  { id: '2', name: 'Dr. Robert Chen', email: 'robert.chen@apexhealth.com', role: 'Lead Physician', branch: 'Westside Branch', status: 'Active' },
  { id: '3', name: 'Jessica Taylor', email: 'jessica.t@apexhealth.com', role: 'Receptionist', branch: 'Main Clinic', status: 'Active' },
  { id: '4', name: 'Michael Scott', email: 'michael.s@apexhealth.com', role: 'Pharmacist', branch: 'Main Clinic', status: 'Invited' },
];

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff & Role Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage clinic practitioners, staff invitations, and RBAC permission roles
          </p>
        </div>

        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-sm">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite Staff Member</span>
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
          <span>Staff Name & Email</span>
          <span>Assigned Role</span>
          <span>Assigned Branch</span>
          <span>Account Status</span>
        </div>

        {mockStaff.map((staff) => (
          <div
            key={staff.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary">
                {staff.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">{staff.name}</div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {staff.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>{staff.role}</span>
            </div>

            <div className="text-xs text-muted-foreground font-medium">
              {staff.branch}
            </div>

            <div>
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                  staff.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}
              >
                {staff.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
