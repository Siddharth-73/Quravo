"use client";

import React, { useState } from 'react';
import { Building, DollarSign, Activity, Users, ArrowUpRight, Search, Plus, Filter } from 'lucide-react';

interface TenantActivity {
  name: string;
  slug: string;
  plan: 'Starter' | 'Growth' | 'ERP';
  status: 'Active' | 'Suspended';
  created: string;
  mrr: number;
}

const initialTenants: TenantActivity[] = [
  { name: 'Apex Health Clinic', slug: 'apex-health', plan: 'ERP', status: 'Active', created: '2026-07-27', mrr: 399 },
  { name: 'Sunrise Dental & Medical Chain', slug: 'sunrise-med', plan: 'Growth', status: 'Active', created: '2026-07-25', mrr: 149 },
  { name: 'Valley Community Hospital', slug: 'valley-hospital', plan: 'ERP', status: 'Active', created: '2026-07-20', mrr: 399 },
  { name: 'Metro Urgent Care', slug: 'metrocure', plan: 'Starter', status: 'Active', created: '2026-07-18', mrr: 49 },
  { name: 'Beacon Pediatric Center', slug: 'beaconpeds', plan: 'Growth', status: 'Suspended', created: '2026-07-10', mrr: 149 },
];

export default function SuperAdminDashboardPage() {
  const [tenants, setTenants] = useState<TenantActivity[]>(initialTenants);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('ALL');

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.slug.includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'ALL' || t.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const totalMRR = tenants.filter((t) => t.status === 'Active').reduce((sum, t) => sum + t.mrr, 0);

  const toggleTenantStatus = (slug: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.slug === slug ? { ...t, status: t.status === 'Active' ? ('Suspended' as const) : ('Active' as const) } : t
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Telemetry & SaaS Metrics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime overview across all active clinic tenants, MRR subscriptions, and infrastructure load
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Provisioned Tenants</span>
            <Building className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{tenants.length} Clinics</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +{tenants.filter((t) => t.status === 'Active').length} active
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Recurring Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">${totalMRR.toLocaleString()}.00</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> ARR: ${(totalMRR * 12).toLocaleString()}
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

      {/* Dynamic Search & Controls */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-sm text-white">Provisioned Tenants Directory</h3>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search by clinic name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white focus:outline-none"
              />
            </div>

            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Tiers</option>
              <option value="Starter">Starter Plan</option>
              <option value="Growth">Growth Plan</option>
              <option value="ERP">ERP Enterprise</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTenants.map((t) => (
            <div
              key={t.slug}
              className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs"
            >
              <div>
                <div className="font-bold text-white text-sm">{t.name}</div>
                <div className="font-mono text-[11px] text-purple-400">{t.slug}.platform.com</div>
              </div>

              <div className="font-semibold text-slate-300">
                {t.plan} Tier (${t.mrr}/mo)
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTenantStatus(t.slug)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                    t.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                  }`}
                >
                  {t.status} (Click to toggle)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
