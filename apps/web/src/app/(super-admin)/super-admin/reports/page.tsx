'use client';

import React from 'react';
import { BarChart2, Download } from 'lucide-react';

export default function SuperAdminReportsPage() {
  const reports = [
    { title: 'Tenant Growth & Adoption Report', description: 'Monthly platform tenant provisioning, churn rate, and active clinic seats.', date: 'July 2026' },
    { title: 'System Usage & API Telemetry Report', description: 'API throughput metrics, database connection pool stats, and storage usage.', date: 'July 2026' },
    { title: 'Platform Security Audit Trail', description: 'Administrative log-ins, privilege escalation events, and permission builder changes.', date: 'July 2026' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Reports & Analytics</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Access selected high-level SaaS platform summaries and export administrative telemetry logs.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div key={rep.title} className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white">{rep.title}</h3>
              <p className="text-xs text-slate-400">{rep.description}</p>
              <span className="text-[10px] text-slate-500 font-mono">Generated: {rep.date}</span>
            </div>
            <button className="px-3.5 py-1.5 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-semibold hover:bg-purple-600/30 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
