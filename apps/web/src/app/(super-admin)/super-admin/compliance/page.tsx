'use client';

import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function SuperAdminCompliancePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Compliance & Data Governance</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure HIPAA & GDPR data retention policies, right-to-erasure workflows, data export requests, and encryption key rotation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="font-bold text-sm text-white">Data Retention Policies</h3>
          <p className="text-slate-400">Audit retention set to 7 years (HIPAA standard). Automatic purge of transient logs after 90 days.</p>
          <button className="px-3 py-1.5 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded font-semibold">
            Update Retention Policy
          </button>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="font-bold text-sm text-white">Right-to-Erasure & Data Export</h3>
          <p className="text-slate-400">Process user data anonymization and export requests within 30-day statutory SLA.</p>
          <button className="px-3 py-1.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded font-semibold">
            Process Erasure Workflows
          </button>
        </div>
      </div>
    </div>
  );
}
