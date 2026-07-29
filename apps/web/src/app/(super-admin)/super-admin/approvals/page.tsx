"use client";

import React, { useState } from 'react';
import { initialTenantRequests, TenantApprovalRequest } from '@/lib/auth/approvals';
import { Building, Check, X, Clock, Sparkles } from 'lucide-react';

export default function SuperAdminApprovalsPage() {
  const [tenantRequests, setTenantRequests] = useState<TenantApprovalRequest[]>(initialTenantRequests);

  const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
    setTenantRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Hospital & Tenant Onboarding Approvals</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review pending hospital registration requests and provision new SaaS subdomains
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Building className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-sm text-white">Pending Clinic Provisioning Requests</h3>
        </div>

        <div className="space-y-3 text-xs">
          {tenantRequests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="font-bold text-white text-sm">{req.clinicName}</div>
                <div className="font-mono text-purple-400 text-[11px]">{req.subdomain}.platform.com • Requested Plan: <span className="font-semibold text-slate-200">{req.plan}</span></div>
                <div className="text-slate-400 mt-0.5">Owner: {req.ownerName} ({req.email})</div>
              </div>

              <div className="flex items-center gap-2">
                {req.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(req.id, 'Approved')}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-xs text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Approve & Provision</span>
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'Rejected')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 text-rose-400 hover:bg-rose-500/10 font-semibold text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded font-semibold text-[11px] ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
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
