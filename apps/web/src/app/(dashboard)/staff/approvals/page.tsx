"use client";

import React, { useState } from 'react';
import { initialStaffRequests, StaffApprovalRequest } from '@/lib/auth/approvals';
import { UserCheck, Check, X, Clock, AlertCircle } from 'lucide-react';

export default function StaffApprovalsPage() {
  const [requests, setRequests] = useState<StaffApprovalRequest[]>(initialStaffRequests);

  const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Clinic Staff Join Approvals</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review pending practitioner & staff join requests before granting access to patient records
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <UserCheck className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">Pending Staff Verification Requests</h3>
        </div>

        <div className="space-y-3 text-xs">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="font-bold text-foreground text-sm">{req.fullName}</div>
                <div className="text-muted-foreground mt-0.5">{req.email} • Requested Role: <span className="font-semibold text-primary">{req.role}</span></div>
                <div className="text-[11px] text-muted-foreground font-mono mt-0.5">Requested at: {req.requestedAt}</div>
              </div>

              <div className="flex items-center gap-2">
                {req.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(req.id, 'Approved')}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Staff</span>
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'Rejected')}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 font-semibold"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded font-semibold text-[11px] ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
