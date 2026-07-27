"use client";

import React from 'react';
import { Building, DollarSign, Activity, Users, ArrowUpRight } from 'lucide-react';

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Platform Telemetry & SaaS Metrics</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Realtime overview across all active clinic tenants, MRR subscriptions, and infrastructure load
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Provisioned Tenants</span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">128 Clinics</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14 this month
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Recurring Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">$48,920.00</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% ARR growth
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Platform Active Users</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">1,450 Staff</div>
          <div className="text-[11px] text-slate-400">Practitioners & Receptionists</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>System Health & Worker Queues</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">99.98%</div>
          <div className="text-[11px] text-slate-400">Redis BullMQ Latency: 4ms</div>
        </div>
      </div>

      {/* Recent Tenant Provisioning Activity */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="font-bold text-sm text-white">Recent Tenant Provisioning Activity</h3>
        <div className="space-y-3">
          {[
            { name: 'Apex Health Clinic', slug: 'apex-health', plan: 'ERP Tier', status: 'Active', created: '2026-07-27' },
            { name: 'Sunrise Dental & Medical Chain', slug: 'sunrise-med', plan: 'Growth Tier', status: 'Active', created: '2026-07-25' },
            { name: 'Valley Community Hospital', slug: 'valley-hospital', plan: 'ERP Tier', status: 'Active', created: '2026-07-20' },
          ].map((t) => (
            <div
              key={t.slug}
              className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs"
            >
              <div>
                <div className="font-bold text-white">{t.name}</div>
                <div className="font-mono text-[11px] text-purple-400">{t.slug}.platform.com</div>
              </div>

              <span className="font-semibold text-slate-300">{t.plan}</span>

              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
