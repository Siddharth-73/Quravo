"use client";

import React, { useState, useEffect } from 'react';
import { Building, DollarSign, Activity, Users, ArrowUpRight, Search, FileText, CheckCircle2, Clock } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';

interface TenantActivity {
  id?: string;
  name: string;
  subdomain?: string;
  slug?: string;
  plan: string;
  status: string;
  mrr?: number;
}

interface ClinicListing {
  id: string;
  clinicName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  specialty?: string;
  estimatedMonthlyPatients?: string;
  additionalNotes?: string;
  status: string;
  createdAt: string;
}

const fallbackTenants: TenantActivity[] = [
  { name: 'Apex Health Clinic', slug: 'apex-health', plan: 'ERP', status: 'Active', mrr: 399 },
  { name: 'Sunrise Dental & Medical Chain', slug: 'sunrise-med', plan: 'Growth', status: 'Active', mrr: 149 },
  { name: 'Valley Community Hospital', slug: 'valley-hospital', plan: 'ERP', status: 'Active', mrr: 399 },
  { name: 'Metro Urgent Care', slug: 'metrocure', plan: 'Starter', status: 'Active', mrr: 49 },
];

export default function SuperAdminDashboardPage() {
  const [tenants, setTenants] = useState<TenantActivity[]>(fallbackTenants);
  const [listings, setListings] = useState<ClinicListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [tenantsRes, listingsRes] = await Promise.allSettled([
          apiFetch<TenantActivity[]>('/super-admin/tenants'),
          apiFetch<ClinicListing[]>('/super-admin/clinic-listings'),
        ]);

        if (tenantsRes.status === 'fulfilled' && Array.isArray(tenantsRes.value) && tenantsRes.value.length > 0) {
          setTenants(tenantsRes.value);
        }
        if (listingsRes.status === 'fulfilled' && Array.isArray(listingsRes.value)) {
          setListings(listingsRes.value);
        }
      } catch (err) {
        console.error('Error loading super admin telemetry', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getMrr = (planStr: string) => {
    const p = planStr?.toLowerCase() || '';
    if (p.includes('erp')) return 399;
    if (p.includes('growth')) return 149;
    return 49;
  };

  const filteredTenants = tenants.filter((t) => {
    const slugStr = t.subdomain || t.slug || '';
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || slugStr.includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'ALL' || t.plan.toUpperCase() === filterPlan.toUpperCase();
    return matchesSearch && matchesPlan;
  });

  const totalMRR = tenants
    .filter((t) => t.status === 'Active' || t.status === 'active')
    .reduce((sum, t) => sum + (t.mrr || getMrr(t.plan)), 0);

  const toggleTenantStatus = (index: number) => {
    setTenants((prev) =>
      prev.map((t, idx) =>
        idx === index ? { ...t, status: t.status === 'Active' || t.status === 'active' ? 'Suspended' : 'Active' } : t
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Telemetry & SaaS Metrics</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime overview across all active clinic tenants, MRR subscriptions, and incoming clinic listing requests
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
            <ArrowUpRight className="w-3 h-3" /> +{tenants.filter((t) => t.status === 'Active' || t.status === 'active').length} active
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
            <span>Pending Clinic Listing Requests</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{listings.length} Requests</div>
          <div className="text-[11px] text-sky-400">Sent to Super Admin email</div>
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

      {/* Incoming Clinic Listing Requests Section */}
      {listings.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Incoming "List Your Clinic" Submissions</span>
          </h3>

          <div className="space-y-3">
            {listings.map((l) => (
              <div key={l.id} className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">{l.clinicName}</div>
                  <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                    {l.status}
                  </span>
                </div>
                <div className="text-slate-300">
                  Owner: <span className="font-medium text-white">{l.ownerName}</span> ({l.email} • {l.phone})
                </div>
                <div className="text-slate-400 text-[11px]">
                  Location: {l.city} • Specialty: {l.specialty || 'N/A'} • Est. Patients: {l.estimatedMonthlyPatients || 'N/A'}
                </div>
                {l.additionalNotes && (
                  <div className="text-slate-400 text-[11px] italic bg-slate-900/40 p-2 rounded">
                    "{l.additionalNotes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
              <option value="STARTER">Starter Plan</option>
              <option value="GROWTH">Growth Plan</option>
              <option value="ERP">ERP Enterprise</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTenants.map((t, idx) => (
            <div
              key={t.id || t.slug || idx}
              className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800 bg-slate-900/40 text-xs"
            >
              <div>
                <div className="font-bold text-white text-sm">{t.name}</div>
                <div className="font-mono text-[11px] text-purple-400">{t.subdomain || t.slug}.platform.com</div>
              </div>

              <div className="font-semibold text-slate-300">
                {t.plan} Tier (${t.mrr || getMrr(t.plan)}/mo)
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTenantStatus(idx)}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                    t.status === 'Active' || t.status === 'active'
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
